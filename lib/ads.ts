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
  HOME_TOP: {
    adUnit: '/78777691/_ED_home/amp_h00',
    divId: 'div-gpt-ad-1708524960000-0',
    sizes: [[970, 90]],
  },
  HOME_BOTTOM: {
    adUnit: '/78777691/_ED_home/amp_fin_ed_home',
    divId: 'div-gpt-ad-home-bottom',
    sizes: [[300, 100], [300, 600], [728, 90], [970, 90], [970, 250], [1110, 90]],
  },
  BANNER_CUADRADO: {
    adUnit: '/78777691/_ED_home/amp_notarelleno3_ed_home',
    divId: 'div-gpt-ad-banner-cuadrado',
    sizes: [[300, 250]],
  },
  BANNER_TOP_MV: {
    adUnit: '/78777691/_ED_top/amp_zocalo',
    divId: 'div-gpt-ad-home-top-mv',
    sizes: [[320, 100]],
  },
} as const;

export type AdSlotConfig = typeof AD_UNITS[keyof typeof AD_UNITS];
