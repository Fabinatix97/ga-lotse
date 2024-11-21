/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/900.css";
import { FontSize, extendTheme } from "@mui/joy/styles";
import { isNullish } from "remeda";

import { MobileBreakpoint } from "@/lib/shared/breakpoints";

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

const noBoxShadow = {
  boxShadow: "none",
};

const noBackdrop = {
  backdropFilter: "none",
};

function fixOutlinedHeight(variant?: string, size?: string) {
  return {
    "--Input-minHeight":
      variant === "outlined" && size === "md" ? "2.25rem" : undefined,
  };
}

export const theme = extendTheme({
  fontFamily: {
    body: "Poppins",
    display: "Poppins",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: "var(--joy-palette-neutral-100)",
          backdrop: "rgba(18, 20, 22, 0.25)",
        },
        text: {
          // neutral.800
          icon: "#171A1C",
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
      fontSize: "1.75rem",
      lineHeight: "1.2",
      fontWeight: "700",
      [`@media (min-width:${customBreakpoints.values.md}px)`]: {
        fontSize: "2.25rem",
      },
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "1.2",
      fontWeight: "700",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.2",
      fontWeight: "700",
    },
    h4: {
      fontSize: "1.125rem",
      lineHeight: "1.2",
      fontWeight: "700",
    },
    "body-md": {
      fontSize: "1rem",
      lineHeight: "1.50",
      fontWeight: "400",
    },
    "title-md": {
      fontSize: "1rem",
      lineHeight: "1.50",
      fontWeight: "700",
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
      fontWeight: "600",
    },
  },
  components: {
    JoySheet: {
      defaultProps: {
        variant: "plain",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.radius.lg,
          padding: theme.spacing(3),
          boxShadow: "none",
          [theme.breakpoints.down(MobileBreakpoint.Down)]: {
            padding: theme.spacing(2),
          },
        }),
      },
    },
    JoySvgIcon: {
      defaultProps: {
        color: "inherit",
      },
    },
    JoyFormControl: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          "& label": {
            fontWeight: theme.fontWeight.md,
            fontSize: theme.fontSize.sm,
            color: ownerState.disabled
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
          },
        }),
      },
    },
    JoyFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography["title-sm"],
        }),
        asterisk: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    JoyFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography["body-xs"],
          color: undefined,
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant),
          ...(ownerState.readOnly && {
            ".MuiFormControl-root:has(&) label": {
              fontWeight: theme.typography["body-sm"].fontWeight,
              color: theme.palette.text.secondary,
            },
            ".MuiFormControl-root &": {
              background: "none",
              paddingInline: 0,
              border: "none",
              "& input": {
                fontFamily: theme.fontFamily,
                ...theme.typography["title-md"],
              },
            },
          }),
        }),
      },
      defaultProps: {
        size: "md",
      },
    },
    JoySelect: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          // Placeholder color is overwritten here to comply with WCAG AA contrast requirements
          // Note: this color is hard to differentiate from the filled color (primary),
          // it is recommended to use labels instead of placeholders where possible.
          color:
            ownerState.value === "" || isNullish(ownerState.value)
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
          "--Select-placeholderOpacity": 1,
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant),
        }),
      },
      defaultProps: {
        size: "md",
        slotProps: {
          listbox: {
            // Place the listbox dropdown that contains the option elements inline in the DOM,
            // next to their reference Select element (instead of below the body).
            // This ensures that the options are accessible, even when placed in Modals (like a Sidebar).
            // See bug: https://github.com/mui/base-ui/issues/289.
            disablePortal: true,
            // Using `fixed` instead of the default `absolute` so that the option dropdowns are still visible when they are larger than their containers.
            // A large dropdown in a small scrolling container would be visually cut off when using `absolute`.
            popperOptions: { strategy: "fixed" },
            // For the reasons mentioned, the dropdowns are created inline in the DOM.
            // By default, Popper.js tries to arrange the dropdowns in their scroll container (`clippingParents`).
            // However, with the `fixed` strategy, the dropdowns can also be displayed outside the surrounding container.
            // Therefore, Popper.js should always be based on the viewport when placing the dropdowns.
            // For this reason, null is passed as the `boundary` to the corresponding modifiers.
            modifiers: [
              {
                name: "preventOverflow",
                options: {
                  boundary: null,
                },
              },
              {
                name: "flip",
                options: {
                  boundary: null,
                },
              },
            ],
          },
        },
      },
    },
    JoyAutocomplete: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant),
        }),
      },
      defaultProps: {
        size: "md",
        openText: "Öffnen",
        closeText: "Schließen",
        clearText: "Leeren",
        noOptionsText: "Keine Treffer",
        loadingText: "Lade…",
      },
    },
    JoyModalClose: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.color && {
            color: theme.palette[ownerState.color].plainColor,
          }),
          "--ModalClose-radius": theme.radius.sm,
          width: "40px",
          height: "40px",
          ".MuiSvgIcon-root": {
            width: "20px",
            height: "20px",
          },
        }),
      },
    },
    JoyDialogTitle: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.color && {
            color: theme.palette[ownerState.color].plainColor,
          }),
          lineHeight: 1.5,
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.25rem",
          },
        }),
      },
    },
    JoyDrawer: {
      styleOverrides: {
        backdrop: noBackdrop,
        content: ({ theme }) => ({
          backgroundColor: theme.vars.palette.common.white,
        }),
      },
    },
  },
});
