/** @typedef {{ term: string; slug: string; category: string; definition: string }} GlossaryEntry */

/** @type {GlossaryEntry[]} */
export const glossaryTerms = [
  {
    term: 'Ask price',
    slug: 'ask-price',
    category: 'Pricing',
    definition:
      'The price at which you can buy the base currency from the broker (the offer). It sits above the bid; the gap between bid and ask is the spread.',
  },
  {
    term: 'Base currency',
    slug: 'base-currency',
    category: 'Pairs',
    definition:
      'The first currency in a pair (e.g. EUR in EUR/USD). A rising pair usually means the base is strengthening against the quote.',
  },
  {
    term: 'Bid price',
    slug: 'bid-price',
    category: 'Pricing',
    definition:
      'The price at which you can sell the base currency to the broker. You typically sell at the bid when you go short or close a long.',
  },
  {
    term: 'Carry trade',
    slug: 'carry-trade',
    category: 'Strategy',
    definition:
      'Borrowing in a low-yield currency to fund positions in a higher-yield one, earning the interest differential over time — swap and rate risk matter.',
  },
  {
    term: 'Cross pair',
    slug: 'cross-pair',
    category: 'Pairs',
    definition:
      'A pair that does not include the US dollar, such as EUR/GBP. Pricing is often derived from two USD legs.',
  },
  {
    term: 'Drawdown',
    slug: 'drawdown',
    category: 'Risk',
    definition:
      'The peak-to-trough decline in account equity during a period. Used to judge strategy resilience and psychological stress.',
  },
  {
    term: 'ECN / STP',
    slug: 'ecn-stp',
    category: 'Brokers',
    definition:
      'Execution models: ECN-style feeds aggregate liquidity; STP routes orders straight through. Both affect spreads and slippage versus dealing-desk models.',
  },
  {
    term: 'Exotic pair',
    slug: 'exotic-pair',
    category: 'Pairs',
    definition:
      'A pair involving a major currency and a smaller or emerging-market currency. Often wider spreads and lower liquidity than majors.',
  },
  {
    term: 'Fibonacci retracement',
    slug: 'fibonacci-retracement',
    category: 'Analysis',
    definition:
      'Levels (often 38.2%, 50%, 61.8%) drawn between a swing high and low, used to find potential support or resistance in a pullback.',
  },
  {
    term: 'Going long / short',
    slug: 'long-short',
    category: 'Orders',
    definition:
      'Long means buying the base currency expecting it to rise versus the quote. Short is the opposite: you sell the base first and aim to buy it back cheaper.',
  },
  {
    term: 'Leverage',
    slug: 'leverage',
    category: 'Risk',
    definition:
      'A multiplier on your margin that controls a larger notional position. It magnifies both gains and losses; effective leverage depends on position size versus equity.',
  },
  {
    term: 'Limit order',
    slug: 'limit-order',
    category: 'Orders',
    definition:
      'An order to buy below market or sell above market at a specified price or better. Fills are not guaranteed if price never reaches the level.',
  },
  {
    term: 'Liquid market',
    slug: 'liquid-market',
    category: 'Market structure',
    definition:
      'A market where large trades can occur with small price impact. Major FX pairs during London–New York overlap are typically the most liquid.',
  },
  {
    term: 'Lot',
    slug: 'lot',
    category: 'Sizing',
    definition:
      'A standardized trade size. A standard lot is often 100,000 units of the base currency; mini and micro lots are common fractions.',
  },
  {
    term: 'Major pair',
    slug: 'major-pair',
    category: 'Pairs',
    definition:
      'Highly traded pairs that include the USD and another major currency, such as EUR/USD, USD/JPY, GBP/USD.',
  },
  {
    term: 'Margin',
    slug: 'margin',
    category: 'Risk',
    definition:
      'Collateral your broker requires to keep a leveraged position open. If equity falls below maintenance margin, you may face a margin call or stop-out.',
  },
  {
    term: 'Margin call',
    slug: 'margin-call',
    category: 'Risk',
    definition:
      'A broker request to add funds or reduce risk when account equity no longer supports open positions at required margin levels.',
  },
  {
    term: 'Market order',
    slug: 'market-order',
    category: 'Orders',
    definition:
      'An order to buy or sell immediately at the best available price. Fast execution but exposed to spread and slippage in fast markets.',
  },
  {
    term: 'Moving average',
    slug: 'moving-average',
    category: 'Analysis',
    definition:
      'The average price over N periods, smoothing noise. Crossovers between short and long averages are a common (and debated) trend signal.',
  },
  {
    term: 'Pip',
    slug: 'pip',
    category: 'Pricing',
    definition:
      'A “point in price” — usually the fourth decimal on most pairs (second for JPY pairs). It quantifies small exchange-rate moves.',
  },
  {
    term: 'Pipette / fractional pip',
    slug: 'pipette',
    category: 'Pricing',
    definition:
      'A tenth of a pip (fifth decimal on many pairs). Brokers quote finer prices for tighter competition on spreads.',
  },
  {
    term: 'Quote currency',
    slug: 'quote-currency',
    category: 'Pairs',
    definition:
      'The second currency in a pair (e.g. USD in EUR/USD). The rate tells you how much quote currency buys one unit of base.',
  },
  {
    term: 'Rollover / swap',
    slug: 'rollover-swap',
    category: 'Costs',
    definition:
      'Interest paid or earned when a spot position is held past the broker’s cutoff. Depends on the rate differential between the two currencies.',
  },
  {
    term: 'RSI (Relative Strength Index)',
    slug: 'rsi',
    category: 'Analysis',
    definition:
      'A momentum oscillator from 0–100. Readings above 70 or below 30 are often treated as overbought or oversold — not automatic reversal signals.',
  },
  {
    term: 'Slippage',
    slug: 'slippage',
    category: 'Execution',
    definition:
      'The difference between the expected fill price and the actual fill, common around news or thin liquidity.',
  },
  {
    term: 'Spread',
    slug: 'spread',
    category: 'Costs',
    definition:
      'The difference between ask and bid. It is a primary trading cost on top of commissions, especially on intraday trades.',
  },
  {
    term: 'Stop-loss order',
    slug: 'stop-loss',
    category: 'Orders',
    definition:
      'An order to close a position at a worse price once the market hits a defined level, capping loss on the trade. Subject to gaps and slippage.',
  },
  {
    term: 'Support and resistance',
    slug: 'support-resistance',
    category: 'Analysis',
    definition:
      'Price zones where buying (support) or selling (resistance) has repeatedly appeared. Breakouts and false breaks both occur at these levels.',
  },
  {
    term: 'Swap rate',
    slug: 'swap-rate',
    category: 'Costs',
    definition:
      'The broker’s applied interest for carrying a position overnight, derived from interbank rates plus the broker’s markup or discount.',
  },
  {
    term: 'Take-profit order',
    slug: 'take-profit',
    category: 'Orders',
    definition:
      'An order to close at a favorable price once reached, locking in gains. Often paired with a stop for a defined risk-reward bracket.',
  },
  {
    term: 'Tick',
    slug: 'tick',
    category: 'Pricing',
    definition:
      'A single change in the quoted bid or ask. High tick frequency usually means active liquidity and short-term noise.',
  },
  {
    term: 'Volatility',
    slug: 'volatility',
    category: 'Risk',
    definition:
      'The magnitude of price swings over time. Implied volatility rises before uncertain events; realized volatility measures what actually happened.',
  },
];

export const glossaryCategories = [...new Set(glossaryTerms.map((t) => t.category))].sort();
