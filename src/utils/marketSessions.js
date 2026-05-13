import { toDate, formatInTimeZone } from 'date-fns-tz';

/**
 * Major FX dealing hubs: typical local “cash market” hours (08:00–17:00)
 * in each IANA zone. Converted to UTC with DST handled by the platform TZ database.
 */
export const fxSessions = [
  {
    id: 'sydney',
    name: 'Sydney',
    city: 'Sydney',
    country: 'Australia',
    timeZone: 'Australia/Sydney',
    openH: 8,
    openM: 0,
    closeH: 17,
    closeM: 0,
    color: 'from-sky-500/30 to-cyan-500/10',
    ring: 'ring-sky-500/30',
    info: 'The Sydney session opens the global FX week. AUD and NZD often lead when Asia-Pacific liquidity builds.',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    timeZone: 'Asia/Tokyo',
    openH: 9,
    openM: 0,
    closeH: 18,
    closeM: 0,
    color: 'from-indigo-500/30 to-violet-500/10',
    ring: 'ring-indigo-500/30',
    info: 'Tokyo is the core Asian hub. JPY pairs and regional flows are usually most active in this window.',
  },
  {
    id: 'london',
    name: 'London',
    city: 'London',
    country: 'United Kingdom',
    timeZone: 'Europe/London',
    openH: 8,
    openM: 0,
    closeH: 17,
    closeM: 0,
    color: 'from-emerald-500/30 to-teal-500/10',
    ring: 'ring-emerald-500/30',
    info: 'London is the largest FX pool. EUR, GBP, and CHF often see their deepest books here.',
  },
  {
    id: 'newyork',
    name: 'New York',
    city: 'New York',
    country: 'United States',
    timeZone: 'America/New_York',
    openH: 8,
    openM: 0,
    closeH: 17,
    closeM: 0,
    color: 'from-amber-500/30 to-orange-500/10',
    ring: 'ring-amber-500/30',
    info: 'New York drives USD flow around U.S. data and equity hours. Overlap with London is often the busiest slice.',
  },
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Calendar date in `timeZone` that contains instant `now`. */
function ymdInZone(now, timeZone) {
  return formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
}

/**
 * UTC instants for local open/close on the hub’s current calendar day.
 */
export function getSessionWindowUtc(session, now = new Date()) {
  const ymd = ymdInZone(now, session.timeZone);
  const openStr = `${ymd} ${pad2(session.openH)}:${pad2(session.openM)}:00`;
  const closeStr = `${ymd} ${pad2(session.closeH)}:${pad2(session.closeM)}:00`;
  const openUtc = toDate(openStr, { timeZone: session.timeZone });
  const closeUtc = toDate(closeStr, { timeZone: session.timeZone });
  return { openUtc, closeUtc, ymd };
}

function formatUtcWindow(openUtc, closeUtc) {
  const d0 = formatInTimeZone(openUtc, 'UTC', 'yyyy-MM-dd');
  const d1 = formatInTimeZone(closeUtc, 'UTC', 'yyyy-MM-dd');
  if (d0 === d1) {
    return `${formatInTimeZone(openUtc, 'UTC', 'HH:mm')}–${formatInTimeZone(closeUtc, 'UTC', 'HH:mm')} UTC`;
  }
  return `${formatInTimeZone(openUtc, 'UTC', 'dd MMM HH:mm')} → ${formatInTimeZone(closeUtc, 'UTC', 'dd MMM HH:mm')} UTC`;
}

function formatLocalWindow(session, openUtc) {
  const tzAbbr = formatInTimeZone(openUtc, session.timeZone, 'zzz');
  return `${pad2(session.openH)}:${pad2(session.openM)}–${pad2(session.closeH)}:${pad2(session.closeM)} (${tzAbbr})`;
}

export function getSessionsLive(now = new Date()) {
  return fxSessions.map((session) => {
    const { openUtc, closeUtc } = getSessionWindowUtc(session, now);
    const open =
      !Number.isNaN(openUtc.getTime()) &&
      !Number.isNaN(closeUtc.getTime()) &&
      now >= openUtc &&
      now < closeUtc;
    return {
      ...session,
      open,
      openUtc,
      closeUtc,
      utcWindow: formatUtcWindow(openUtc, closeUtc),
      localWindow: formatLocalWindow(session, openUtc),
    };
  });
}

/** Live clock string in true UTC (updates every second in the UI). */
export function formatLiveUtc(now = new Date()) {
  return formatInTimeZone(now, 'UTC', "EEE, dd MMM yyyy HH:mm:ss 'UTC'");
}

/** Same instant in the user’s device timezone (IANA name appended). */
export function formatLiveDeviceTime(now = new Date()) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body = formatInTimeZone(now, tz, 'EEE, dd MMM yyyy HH:mm:ss');
  return { text: body, timeZone: tz };
}
