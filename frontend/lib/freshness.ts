import { getGuides } from "./guides";
import { seedArticles } from "./seed";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const ZONED_DATETIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-]\d{2}:\d{2})$/;

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

function buildUtcTimestamp(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
  offsetMinutes = 0,
): number | null {
  if (
    !isValidCalendarDate(year, month, day) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, millisecond);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const timestamp = date.getTime() - offsetMinutes * 60_000;
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseStrictTimestamp(value: string): number | null {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(value);
  if (dateOnlyMatch) {
    return buildUtcTimestamp(
      Number(dateOnlyMatch[1]),
      Number(dateOnlyMatch[2]),
      Number(dateOnlyMatch[3]),
    );
  }

  const datetimeMatch = ZONED_DATETIME_PATTERN.exec(value);
  if (!datetimeMatch) {
    return null;
  }

  const zone = datetimeMatch[8];
  let offsetMinutes = 0;
  if (zone !== "Z") {
    const offsetHours = Number(zone.slice(1, 3));
    const offsetMinutePart = Number(zone.slice(4, 6));
    if (offsetHours > 23 || offsetMinutePart > 59) {
      return null;
    }
    const direction = zone.startsWith("+") ? 1 : -1;
    offsetMinutes = direction * (offsetHours * 60 + offsetMinutePart);
  }

  const fraction = datetimeMatch[7] || "";
  const millisecond = Number(`${fraction}000`.slice(0, 3));

  return buildUtcTimestamp(
    Number(datetimeMatch[1]),
    Number(datetimeMatch[2]),
    Number(datetimeMatch[3]),
    Number(datetimeMatch[4]),
    Number(datetimeMatch[5]),
    Number(datetimeMatch[6] || "0"),
    millisecond,
    offsetMinutes,
  );
}

export function getLatestIsoTimestamp(
  values: string[],
  now: number | string = Date.now(),
): string | null {
  const nowTimestamp = typeof now === "number"
    ? (Number.isFinite(now) ? now : null)
    : parseStrictTimestamp(now);

  if (nowTimestamp === null) {
    return null;
  }

  let latestTimestamp: number | null = null;
  for (const value of values) {
    const timestamp = parseStrictTimestamp(value);
    if (
      timestamp !== null &&
      timestamp <= nowTimestamp &&
      (latestTimestamp === null || timestamp > latestTimestamp)
    ) {
      latestTimestamp = timestamp;
    }
  }

  return latestTimestamp === null ? null : new Date(latestTimestamp).toISOString();
}

export function formatEditorialDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function getBuildTimestamp(): number | string {
  return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || Date.now();
}

export function getLatestEditorialUpdate(): string | null {
  const articleUpdates = seedArticles
    .filter((article) => article.status === "published")
    .map((article) => article.updatedAt);
  const guideUpdates = getGuides().map((guide) => guide.updatedAt);

  return getLatestIsoTimestamp([...articleUpdates, ...guideUpdates], getBuildTimestamp());
}
