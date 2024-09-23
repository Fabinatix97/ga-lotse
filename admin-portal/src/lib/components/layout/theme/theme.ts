/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// 300, 500, 600 and 700 are default fontWeight design tokens in Joy UI (xs, md, lg, xl). These values are used in Joy components.
// 400 is the CSS default and used in the ga-lotse typography (which does not affect Joy components other than Typography).
// Similar installation guide: https://mui.com/joy-ui/getting-started/installation/#google-web-fonts
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { FontSize, extendTheme } from "@mui/joy/styles";

import { customBreakpoints } from "./customBreakpoints";

declare module "@mui/joy/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xxl: true;
  }
}

declare module "@mui/joy/styles/types/zIndex" {
  interface ZIndexOverrides {
    sideNavigation: true;
    header: true;
  }
}

type FontSizeOverrides = { [_k in keyof FontSize]: true };
declare module "@mui/joy/SvgIcon" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SvgIconPropsSizeOverrides extends FontSizeOverrides {}
}

export const theme = extendTheme({
  fontFamily: {
    body: "Poppins",
    display: "Poppins",
  },
  colorSchemes: {
    light: {
      palette: {
        neutral: {
          plainHoverBg: "rgb(245, 247, 250)",
        },
        background: {
          backdrop: "rgba(18, 20, 22, 0.25)",
          body: "var(--joy-palette-background-level1)",
          level2: "var(--joy-palette-common-white, #FFF)",
        },
      },
    },
  },
  breakpoints: customBreakpoints,
  spacing: 8,
  zIndex: {
    sideNavigation: 100,
    header: 500,
  },
  typography: {
    h1: {
      fontSize: "var(--joy-fontSize-xl2, 1.5rem)",
      lineHeight: "var(--joy-lineHeight-md, 1.5)",
      fontWeight: "var(--joy-fontWeight-lg, 600)",
      color: "var(--joy-palette-text-tertiary)",
      letterSpacing: "unset",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "1",
      fontWeight: "600",
      [`@media (min-width:${customBreakpoints.values.md}px)`]: {
        fontSize: "2.25rem",
      },
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.25",
      fontWeight: "600",
      [`@media (min-width:${customBreakpoints.values.md}px)`]: {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontSize: "1.125rem",
      lineHeight: "1.25",
      fontWeight: "600",
      [`@media (min-width:${customBreakpoints.values.md}px)`]: {
        fontSize: "1.25rem",
      },
    },
    "body-lg": {
      fontSize: "1.125rem",
      lineHeight: "1.50",
      fontWeight: "400",
    },
    "title-lg": {
      fontSize: "1.125rem",
      lineHeight: "1.50",
      fontWeight: "600",
    },
    "body-md": {
      fontSize: "1rem",
      lineHeight: "1.50",
      fontWeight: "400",
    },
    "title-md": {
      fontSize: "1rem",
      lineHeight: "1.50",
      fontWeight: "600",
    },
    "body-sm": {
      fontSize: "0.875rem",
      lineHeight: "1.50",
      fontWeight: "400",
    },
    "title-sm": {
      fontSize: "0.875rem",
      lineHeight: "1.50",
      fontWeight: "600",
    },
    "body-xs": {
      fontSize: "0.75rem",
      lineHeight: "1.50",
      fontWeight: "400",
    },
  },
  components: {
    JoyList: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          "--List-padding": theme.spacing(0),
          "--List-radius": theme.radius.md,
          "--variant-plainColor": "var(--joy-palette-text-secondary)",
          ...(!ownerState.nesting && {
            gap: "var(--ListItem-gap)",
          }),
        }),
      },
    },
    JoyListItem: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(!ownerState.nested && {
            borderLeft: `1px solid ${theme.palette.divider}`,
            borderRadius: 0,
            marginLeft: theme.spacing(3),
            "&:first-of-type": {
              paddingTop: 0,
            },
            "&:last-of-type": {
              paddingBottom: 0,
            },
            "--ListItemButton-marginBlock": 0,
          }),
        }),
      },
    },
    JoyTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          "--TableCell-headBackground": theme.vars.palette.background.level2,
          "--TableCell-paddingY": theme.spacing(1),
          "--TableCell-paddingX": theme.spacing(1.5),
          "--TableRow-stripeBackground": theme.palette.background.level1,
          color: "#32383E",
          overflow: "hidden",
          position: "relative",
          background: theme.palette.background.level2,
          boxShadow: "none",
        }),
      },
    },
    JoyDrawer: {
      styleOverrides: {
        backdrop: {
          backdropFilter: "none",
        },
      },
    },
    JoyStack: {
      styleOverrides: {
        root: {
          flexDirection: "row",
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:disabled": {
            background: theme.palette.background.level2,
          },
        }),
      },
    },
    JoyAutocomplete: {
      defaultProps: {
        openText: "Öffnen",
        closeText: "Schließen",
        clearText: "Leeren",
        noOptionsText: "Keine Treffer",
        loadingText: "Lade…",
      },
    },
  },
});
