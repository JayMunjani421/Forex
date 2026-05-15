import { Link2 } from 'lucide-react';
import zerodhaLogo from '../../assets/zerodha.png';
import aliceBlueLogo from '../../assets/alice_blue.svg';
import angelOneLogo from '../../assets/angel_one.png';
import dhanLogo from '../../assets/dhan.png';
import fyersLogo from '../../assets/fyers.svg';
import upstoxLogo from '../../assets/upstox.svg';
import mstockLogo from '../../assets/mstock.png';

const BROKERS = [
  { name: 'Zerodha', logo: zerodhaLogo },
  { name: 'Alice Blue', logo: aliceBlueLogo },
  { name: 'Angel One', logo: angelOneLogo },
  { name: 'Dhan', logo: dhanLogo },
  { name: 'FYERS', logo: fyersLogo },
  { name: 'Upstox', logo: upstoxLogo },
  { name: 'Mstock', logo: mstockLogo },
];

export default function SupportedBrokers() {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#0d1323]/70 p-6 backdrop-blur-xl md:p-8">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          Broker Connectivity Is Mandatory
        </span>
      </div>
      <h2 className="mt-4 text-center text-2xl font-bold text-white md:text-3xl">Supported Brokers</h2>
      <p className="mt-2 text-center text-sm text-slate-400 md:text-base">
        Connect with your preferred trading platform
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {BROKERS.map((broker) => (
          <li
            key={broker.name}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0a0f1a]/80 px-3 py-2.5 transition hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <img
              src={broker.logo}
              alt=""
              className="h-7 w-7 shrink-0 object-contain"
              loading="lazy"
            />
            <span className="text-sm font-medium text-slate-200">{broker.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
