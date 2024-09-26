/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface ContentMargin {
  topBottom: number;
  leftRight: number;
}

export const headerHeightMobile = "4.75rem"; // 76px
export const headerHeightDesktop = "9rem"; // 144px

export const bannerHeightMobile = "7.75rem"; // 124px
export const bannerHeightDesktop = "20rem"; // 320px

export const maxContentWidthDesktop = "1232px";
export const contentMarginDesktop: ContentMargin = {
  topBottom: 3,
  leftRight: 3.5,
};
export const contentMarginMobile: ContentMargin = {
  topBottom: 2,
  leftRight: 2,
};

export const headerLogoHeightMobile = "44px"; // TODO: adapt or remove when we have real logo
export const headerLogoHeightDesktop = "80px";

export const headerLogoWidthMobile = "115px";
export const headerLogoWidthDesktop = "174px";

export const footerMaxWidthDesktop = "1220px";
