// ══════════════════════════════════════════════
// CONFIG — screens, copy and thresholds as data, not hardcoded strings
// (learning-design doc §9: architect for A/B testing now; randomizing which
// config a user sees later becomes a small change, not a rebuild).
// ══════════════════════════════════════════════

const TARIGA_CONFIG = {
  variant: 'default',
  home: {
    ctaTitle: 'Start',
    ctaSub: 'يلا نتكلم (yalla nitkallam) — let\'s talk',
    focusLabel: "Today's focus",
  },
  warmup: {
    minDaysAway: 2,        // offer the warm-up after this many days away
    maxSteps: 3,
  },
  unlock: {
    beginningShare: 0.8,   // share of Beginning items practiced → Comfortable tier
  },
  review: {
    liveThreshold: 3,      // total vote weight needed for a submission to go live
    tiers: [               // organic trust track (§17.1 Track 1)
      { name: 'New reviewer', min: 0, weight: 1 },
      { name: 'Contributor', min: 5, weight: 2 },
      { name: 'Trusted reviewer', min: 15, weight: 3 },
    ],
    // vouched fast track (§17.1 Track 2): an elder vouched in by a trusted
    // member lands with full authority from day one
    elder: { name: 'Community Elder', weight: 3 },
    vouchMinTier: 'Trusted reviewer',   // who may vouch someone in
  },
  speed: { seconds: 60 },  // timed automatization rounds (DeKeyser)
  livecall: { maxTurns: 8 },
  coach: { maxTokens: 3000 },
};
