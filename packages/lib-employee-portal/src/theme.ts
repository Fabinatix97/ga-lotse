/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FontSize } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xxl: true;
  }

  interface Palette {
    a11y: {
      primary: string;
      neutral: string;
      danger: string;
      warning?: string;
      success?: string;
    };
  }

  interface PaletteColor extends Palette {
    a11y: {
      primary: string;
      neutral: string;
      danger: string;
      warning?: string;
      success?: string;
    };
  }
}

declare module "@mui/joy/styles/types/zIndex" {
  interface ZIndexOverrides {
    toolbar: true;
    sidebar: true;
    sideNavigation: true;
    header: true;
  }
}

declare module "@mui/joy/ToggleButtonGroup" {
  interface ToggleButtonGroupPropsVariantOverrides {
    tabs: true;
  }
}

type FontSizeOverrides = { [_k in keyof FontSize]: true };
declare module "@mui/joy/SvgIcon" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SvgIconPropsSizeOverrides extends FontSizeOverrides {}
}
