/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface ContentMargin {
  topBottom: number;
  leftRight: number;
}

export const appBarHeightMobile = "4.75rem"; // 76px
export const appBarHeightDesktop = "9rem"; // 144px

export const maxContentWidthDesktop = "1232px";
export const contentMarginDesktop: ContentMargin = {
  topBottom: 3,
  leftRight: 3.5,
};
export const contentMarginMobile: ContentMargin = {
  topBottom: 2,
  leftRight: 2,
};
