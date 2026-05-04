export const AD_UNITS = {
  HOME_LEFT: {
    adUnit: '/78777691/_ED_top/amp_h_lizq',
    divId: 'div-gpt-ad-1708524934819-0',
    sizes: [[120, 600]],
  },
  HOME_RIGHT: {
    adUnit: '/78777691/_ED_top/amp_h_lder',
    divId: 'div-gpt-ad-1708524958974-0',
    sizes: [[120, 600]],
  },
} as const;

export type AdSlotConfig = typeof AD_UNITS[keyof typeof AD_UNITS];
