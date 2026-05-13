/** @typedef {{ slug: string; title: string; dateISO: string; excerpt: string; paragraphs: string[] }} BlogPost */

/** @type {BlogPost[]} */
export const blogPosts = [
  {
    slug: 'week-in-fx-macro-liquidity',
    title: 'Week in FX: macro drivers and liquidity pockets',
    dateISO: '2026-05-05',
    excerpt:
      'How scheduled data and session overlaps shaped volatility last week, and what to watch when planning entries around the clock.',
    paragraphs: [
      'Most retail forex risk still clusters around the London open and the London–New York overlap. Even when Asia prints large ranges on yen crosses, dollar majors often compress until European desks arrive.',
      'If you trade breakouts, note when high-impact releases stack in the same session: spreads can widen and stops hunt both sides before a trend resumes. Use your broker’s calendar for exact times and revisions.',
      'For the week ahead, mark where your sleep schedule intersects the overlap you actually trade — then size positions so a gap through your stop does not breach your max daily loss.',
    ],
  },
  {
    slug: 'week-in-fx-swap-and-holds',
    title: 'Week in FX: holding through rollover and swap math',
    dateISO: '2026-04-28',
    excerpt:
      'A quick look at why Wednesday triple swap still surprises newer traders, and how to reconcile broker swap tables with the swap calculator on this site.',
    paragraphs: [
      'Carry and swap flip sign when you flip direction on the same pair. If you are unsure, plug the same notional into the swap calculator for long versus short and compare — the magnitude should mirror your broker’s table within a reasonable tolerance.',
      'Holding from Tuesday into Wednesday often accrues three days of swap on many platforms because it rolls through the weekend booking convention. Policies differ; always read your broker’s spec sheet.',
      'If swap is a material cost relative to your target in pips, either shorten horizon or pick pairs where the differential works in your favor — after fees.',
    ],
  },
  {
    slug: 'week-in-fx-risk-lines',
    title: 'Week in FX: drawing risk lines before price',
    dateISO: '2026-04-21',
    excerpt:
      'Position sizing first, chart second: a short framework for aligning lot size, stop distance, and account heat before you look for patterns.',
    paragraphs: [
      'Decide the maximum you are willing to lose on the trade in account currency, then translate that into lots using stop distance — the lot-size calculator on this site is built around that sequence.',
      'Only after risk is bounded should you debate whether the setup is “good enough.” That order reduces impulse scaling when a level looks tempting but the stop must sit too far away.',
      'Journal one line each day: planned risk versus realized outcome. Over a month you will see whether your issue is entry quality or distribution of risk across correlated pairs.',
    ],
  },
];
