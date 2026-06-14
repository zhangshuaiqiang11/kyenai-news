import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildOauthAuthorizationUrl,
  buildSearchAnalyticsBody,
  hasSearchData,
  normalizeGscSiteUrl,
  parseArgs,
  parseGoogleCredentials,
  requestAccessToken,
  toIsoDate,
} from "./gsc-probe.mjs";

describe("normalizeGscSiteUrl", () => {
  it("keeps URL-prefix properties slash-terminated", () => {
    assert.equal(normalizeGscSiteUrl("https://www.kyenai.com"), "https://www.kyenai.com/");
  });

  it("keeps domain properties unchanged", () => {
    assert.equal(normalizeGscSiteUrl("sc-domain:kyenai.com"), "sc-domain:kyenai.com");
  });
});

describe("buildSearchAnalyticsBody", () => {
  it("builds a query/page request for a date window", () => {
    assert.deepEqual(buildSearchAnalyticsBody("2026-06-01", "2026-06-05", 250), {
      startDate: "2026-06-01",
      endDate: "2026-06-05",
      dimensions: ["query", "page"],
      rowLimit: 250,
      startRow: 0,
    });
  });
});

describe("hasSearchData", () => {
  it("requires positive impressions", () => {
    assert.equal(hasSearchData([{ clicks: 0, impressions: 1 }]), true);
    assert.equal(hasSearchData([{ clicks: 3, impressions: 0 }]), false);
    assert.equal(hasSearchData([]), false);
  });
});

describe("parseArgs", () => {
  it("accepts explicit date and row options", () => {
    assert.deepEqual(parseArgs(["--start=2026-06-01", "--end=2026-06-03", "--rows=25"]), {
      startDate: "2026-06-01",
      endDate: "2026-06-03",
      rowLimit: 25,
    });
  });

  it("accepts OAuth helper options", () => {
    assert.deepEqual(parseArgs(["--print-auth-url", "--exchange-code=abc123"]), {
      printAuthUrl: true,
      exchangeCode: "abc123",
    });
  });
});

describe("toIsoDate", () => {
  it("formats UTC dates as YYYY-MM-DD", () => {
    assert.equal(toIsoDate(new Date("2026-06-06T23:30:00Z")), "2026-06-06");
  });
});

describe("parseGoogleCredentials", () => {
  it("detects service account credentials", () => {
    assert.deepEqual(parseGoogleCredentials({ client_email: "bot@example.com", private_key: "key" }), {
      type: "service_account",
      client_email: "bot@example.com",
      private_key: "key",
    });
  });

  it("detects installed OAuth client credentials", () => {
    const credentials = parseGoogleCredentials({
      installed: {
        client_id: "client-id",
        client_secret: "client-secret",
        redirect_uris: ["http://localhost"],
      },
    });

    assert.equal(credentials.type, "oauth_client");
    assert.equal(credentials.client_id, "client-id");
    assert.equal(credentials.client_secret, "client-secret");
    assert.equal(credentials.redirect_uri, "http://localhost");
  });
});

describe("buildOauthAuthorizationUrl", () => {
  it("builds an offline Search Console consent URL", () => {
    const url = new URL(
      buildOauthAuthorizationUrl(
        {
          type: "oauth_client",
          client_id: "client-id",
          client_secret: "client-secret",
          redirect_uri: "http://localhost",
        },
        "state-123",
      ),
    );

    assert.equal(url.origin + url.pathname, "https://accounts.google.com/o/oauth2/v2/auth");
    assert.equal(url.searchParams.get("client_id"), "client-id");
    assert.equal(url.searchParams.get("access_type"), "offline");
    assert.equal(url.searchParams.get("prompt"), "consent");
    assert.equal(url.searchParams.get("scope"), "https://www.googleapis.com/auth/webmasters.readonly");
  });
});

describe("requestAccessToken", () => {
  it("uses OAuth refresh tokens for installed client credentials", async () => {
    let requestBody = "";
    const token = await requestAccessToken(
      {
        type: "oauth_client",
        client_id: "client-id",
        client_secret: "client-secret",
        redirect_uri: "http://localhost",
      },
      { GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-token" },
      async (_url, options) => {
        requestBody = String(options.body);
        return new Response(JSON.stringify({ access_token: "access-token" }), { status: 200 });
      },
    );

    assert.equal(token, "access-token");
    assert.match(requestBody, /grant_type=refresh_token/);
    assert.match(requestBody, /refresh_token=refresh-token/);
    assert.match(requestBody, /client_id=client-id/);
  });
});
