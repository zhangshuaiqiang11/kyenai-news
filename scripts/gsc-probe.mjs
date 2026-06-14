import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SEARCH_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export function normalizeGscSiteUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("sc-domain:")) {
    return trimmed;
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export function buildSearchAnalyticsBody(startDate, endDate, rowLimit = 1000) {
  return {
    startDate,
    endDate,
    dimensions: ["query", "page"],
    rowLimit,
    startRow: 0,
  };
}

export function hasSearchData(rows) {
  return Array.isArray(rows) && rows.some((row) => Number(row.impressions || 0) > 0);
}

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function parseArgs(argv) {
  const options = {};
  for (const arg of argv) {
    if (arg.startsWith("--start=")) {
      options.startDate = arg.slice("--start=".length);
    } else if (arg.startsWith("--end=")) {
      options.endDate = arg.slice("--end=".length);
    } else if (arg.startsWith("--rows=")) {
      options.rowLimit = Number.parseInt(arg.slice("--rows=".length), 10);
    } else if (arg === "--print-auth-url") {
      options.printAuthUrl = true;
    } else if (arg.startsWith("--exchange-code=")) {
      options.exchangeCode = arg.slice("--exchange-code=".length);
    }
  }
  return options;
}

export async function main(argv = process.argv.slice(2), env = process.env, fetchImpl = fetch) {
  const args = parseArgs(argv);
  const siteUrl = normalizeGscSiteUrl(env.GSC_SITE_URL || env.NEXT_PUBLIC_SITE_URL || env.SITE_URL);
  const credentialsPath = env.GOOGLE_APPLICATION_CREDENTIALS;
  const endDate = args.endDate || toIsoDate(addUtcDays(new Date(), -2));
  const startDate = args.startDate || toIsoDate(addUtcDays(new Date(`${endDate}T00:00:00Z`), -6));
  const rowLimit = args.rowLimit || 1000;

  if (!siteUrl) {
    throw codedError("missing_site_url", "Set GSC_SITE_URL to the verified Search Console property URL.");
  }
  if (!credentialsPath) {
    throw codedError("missing_credentials_env", "Set GOOGLE_APPLICATION_CREDENTIALS to a Google service account or OAuth client JSON file.");
  }
  if (!fs.existsSync(credentialsPath)) {
    throw codedError(
      "missing_credentials_file",
      `Google credentials file was not found: ${credentialsPath}`
    );
  }

  const credentials = readGoogleCredentials(credentialsPath);
  if (args.printAuthUrl) {
    if (credentials.type !== "oauth_client") {
      throw codedError("oauth_client_required", "OAuth authorization URLs require an installed or web OAuth client JSON file.");
    }
    console.log(
      JSON.stringify(
        {
          ok: true,
          authorizationUrl: buildOauthAuthorizationUrl(credentials, crypto.randomUUID()),
          nextStep: "Open this URL, approve Search Console readonly access, then run this script with --exchange-code=<code>.",
        },
        null,
        2
      )
    );
    return;
  }
  if (args.exchangeCode) {
    if (credentials.type !== "oauth_client") {
      throw codedError("oauth_client_required", "Authorization code exchange requires an installed or web OAuth client JSON file.");
    }
    const token = await exchangeOauthCode(credentials, args.exchangeCode, fetchImpl);
    console.log(
      JSON.stringify(
        {
          ok: true,
          hasRefreshToken: Boolean(token.refresh_token),
          refreshToken: token.refresh_token || null,
          nextStep: "Save refreshToken as GOOGLE_OAUTH_REFRESH_TOKEN in production secrets.",
        },
        null,
        2
      )
    );
    return;
  }

  const accessToken = await requestAccessToken(credentials, env, fetchImpl);
  const body = buildSearchAnalyticsBody(startDate, endDate, rowLimit);
  const report = await querySearchAnalytics(siteUrl, accessToken, body, fetchImpl);
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const totals = summarizeRows(rows);

  console.log(
    JSON.stringify(
      {
        ok: true,
        siteUrl,
        startDate,
        endDate,
        rowCount: rows.length,
        totals,
        hasData: hasSearchData(rows),
        topRows: rows.slice(0, 10).map(formatRow),
      },
      null,
      2
    )
  );
}

function readGoogleCredentials(credentialsPath) {
  const parsed = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  return parseGoogleCredentials(parsed);
}

export function parseGoogleCredentials(parsed) {
  if (parsed.client_email && parsed.private_key) {
    return {
      type: "service_account",
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  }
  const oauthClient = parsed.installed || parsed.web;
  if (oauthClient?.client_id && oauthClient?.client_secret) {
    return {
      type: "oauth_client",
      client_id: oauthClient.client_id,
      client_secret: oauthClient.client_secret,
      redirect_uri: oauthClient.redirect_uris?.[0] || "http://localhost",
    };
  }
  throw codedError(
    "invalid_credentials_file",
    "Google credentials JSON must be a service account with client_email/private_key or an OAuth client with client_id/client_secret."
  );
}

export async function requestAccessToken(credentials, env = process.env, fetchImpl = fetch) {
  if (credentials.type === "service_account") {
    return requestServiceAccountAccessToken(credentials, fetchImpl);
  }
  if (credentials.type === "oauth_client") {
    return requestOauthRefreshAccessToken(credentials, env.GOOGLE_OAUTH_REFRESH_TOKEN, fetchImpl);
  }
  throw codedError("invalid_credentials_type", "Unsupported Google credentials type.");
}

async function requestServiceAccountAccessToken(serviceAccount, fetchImpl) {
  const assertion = buildJwtAssertion(serviceAccount);
  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const payload = await readJsonResponse(response, "Google OAuth token request failed");
  if (!payload.access_token) {
    throw codedError("missing_access_token", "Google OAuth response did not include an access token.");
  }
  return payload.access_token;
}

async function requestOauthRefreshAccessToken(credentials, refreshToken, fetchImpl) {
  if (!refreshToken) {
    throw codedError(
      "missing_oauth_refresh_token",
      "OAuth client credentials require GOOGLE_OAUTH_REFRESH_TOKEN. Run with --print-auth-url, approve access, then exchange the code."
    );
  }
  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const payload = await readJsonResponse(response, "Google OAuth refresh failed");
  if (!payload.access_token) {
    throw codedError("missing_access_token", "Google OAuth response did not include an access token.");
  }
  return payload.access_token;
}

export function buildOauthAuthorizationUrl(credentials, state) {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", credentials.client_id);
  url.searchParams.set("redirect_uri", credentials.redirect_uri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SEARCH_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);
  return url.toString();
}

async function exchangeOauthCode(credentials, code, fetchImpl) {
  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      code,
      redirect_uri: credentials.redirect_uri,
      grant_type: "authorization_code",
    }),
  });
  return readJsonResponse(response, "Google OAuth authorization code exchange failed");
}

function buildJwtAssertion(serviceAccount) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope: SEARCH_SCOPE,
    aud: TOKEN_URL,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  };
  const unsigned = `${base64urlJson(header)}.${base64urlJson(claim)}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), serviceAccount.private_key).toString("base64url");
  return `${unsigned}.${signature}`;
}

async function querySearchAnalytics(siteUrl, accessToken, body, fetchImpl) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return readJsonResponse(response, "Search Console query failed");
}

async function readJsonResponse(response, fallbackMessage) {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const message = payload.error?.message || text || fallbackMessage;
    throw codedError("google_api_error", message);
  }
  return payload;
}

function summarizeRows(rows) {
  return rows.reduce(
    (totals, row) => ({
      clicks: totals.clicks + Number(row.clicks || 0),
      impressions: totals.impressions + Number(row.impressions || 0),
    }),
    { clicks: 0, impressions: 0 }
  );
}

function formatRow(row) {
  const [query, page] = row.keys || [];
  return {
    query,
    page,
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr ?? null,
    position: row.position ?? null,
  };
}

function addUtcDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function base64urlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    const code = error.code || "gsc_probe_failed";
    console.error(JSON.stringify({ ok: false, code, message: error.message }, null, 2));
    process.exitCode = code.startsWith("missing_") ? 2 : 1;
  });
}
