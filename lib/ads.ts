export const AD_UNITS = {
  HOME_LEFT: {
    adUnit: '/78777691/DDHLI',
    divId: 'div-gpt-ad-1708524934819-0',
    sizes: [[300, 600], [160, 600], [120, 600]],
  },
  HOME_RIGHT: {
    adUnit: '/78777691/DDHLD',
    divId: 'div-gpt-ad-1708524958974-0',
    sizes: [[300, 600], [160, 600], [120, 600]],
  },
} as const;

export type AdSlotConfig = typeof AD_UNITS[keyof typeof AD_UNITS];
