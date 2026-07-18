const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const ZONED_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

function parseEditorialDate(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const dateMatch = DATE_ONLY_PATTERN.exec(value);
  if (!dateMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? timestamp
    : null;
}

function parseBuildTimestamp(value: string | undefined): number | null {
  if (!value || !ZONED_TIMESTAMP_PATTERN.test(value)) {
    return null;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function formatDateInTimeZone(timestamp: number, timeZone: string): string | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(timestamp));
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  } catch {
    return null;
  }
}

export function getVisibleEditorialUpdate(): string | null {
  const update = process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE;
  const updateTimestamp = parseEditorialDate(update);
  const buildTimestamp = parseBuildTimestamp(process.env.NEXT_PUBLIC_BUILD_TIMESTAMP);
  const buildDate = buildTimestamp === null
    ? null
    : formatDateInTimeZone(
        buildTimestamp,
        process.env.NEXT_PUBLIC_EDITORIAL_TIME_ZONE || "Asia/Shanghai",
      );

  if (
    updateTimestamp === null ||
    buildTimestamp === null ||
    buildDate === null ||
    update! > buildDate
  ) {
    return null;
  }

  return new Date(updateTimestamp).toISOString();
}
