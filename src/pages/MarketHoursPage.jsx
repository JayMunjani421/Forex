import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { getSessionsLive, formatLiveUtc, formatLiveDeviceTime } from '../utils/marketSessions';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function MarketHoursPage() {
  useDocumentTitle('Forex Tools — Sessions');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const states = getSessionsLive(now);
  const utcStr = formatLiveUtc(now);
  const { text: localBody, timeZone: localTz } = formatLiveDeviceTime(now);

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <PageHeading>Sessions & market hours</PageHeading>
          <p className="mt-3 text-lg font-light leading-relaxed text-indigo-100/70">
            Each hub uses typical local business hours (see cards), converted to UTC with real daylight-saving rules
            (IANA zones). The clocks below are live; session windows refresh for that hub’s current calendar day.
          </p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-[#0d1323]/70 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-indigo-300">
            <Clock className="h-5 w-5" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wider">Live clocks</h2>
          </div>
          <p className="mt-3 font-mono text-sm tracking-tight text-slate-200 tabular-nums">{utcStr}</p>
          <p className="mt-2 font-mono text-sm tracking-tight text-slate-400 tabular-nums">
            {localBody} <span className="text-slate-500">({localTz})</span>
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {states.map((s) => (
            <li
              key={s.id}
              className={`rounded-3xl border bg-linear-to-br p-6 ring-1 backdrop-blur-xl ${s.color} ${
                s.open ? `${s.ring} border-indigo-400/40 shadow-lg shadow-indigo-500/10` : 'border-white/5 ring-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{s.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {s.city}, {s.country}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{s.timeZone}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    s.open ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Local window</p>
              <p className="mt-1 font-mono text-sm text-slate-200">{s.localWindow}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Same window in UTC</p>
              <p className="mt-1 font-mono text-sm text-slate-300">{s.utcWindow}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{s.info}</p>
            </li>
          ))}
        </ul>

        <section className="rounded-3xl border border-indigo-500/20 bg-[#12192b]/60 p-6">
          <h2 className="text-lg font-bold text-white">Why overlaps matter</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            When London and New York are both active, depth on euro and cable often improves — but scheduled data from
            either side can still spike spreads. Tokyo hours can dominate yen crosses even when London is quiet. Match
            your strategy to the session where your edge actually appears.
          </p>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#0c1221]/80 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Reference (today, live UTC)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Session</th>
                  <th className="py-2 pr-3 font-semibold">Country</th>
                  <th className="hidden py-2 pr-3 font-semibold sm:table-cell">IANA</th>
                  <th className="py-2 pr-3 font-semibold">Local</th>
                  <th className="py-2 font-mono font-semibold">UTC</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {getSessionsLive(now).map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-2 pr-3 font-medium text-white">{s.name}</td>
                    <td className="py-2 pr-3 text-xs">{s.country}</td>
                    <td className="hidden max-w-[140px] truncate py-2 pr-3 font-mono text-[10px] text-slate-500 sm:table-cell">
                      {s.timeZone}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{s.localWindow}</td>
                    <td className="py-2 font-mono text-xs">{s.utcWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
