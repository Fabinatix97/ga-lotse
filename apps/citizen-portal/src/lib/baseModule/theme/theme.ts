/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/900.css";
import { FontSize, Theme, extendTheme } from "@mui/joy/styles";
import { isNullish } from "remeda";

import { MobileBreakpoint } from "@/lib/shared/breakpoints";

import { customBreakpoints } from "./customBreakpoints";

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

function a11yInputBorderOutline(theme: Theme, color: string | undefined) {
  const typedColor = color as
    | "primary"
    | "neutral"
    | "danger"
    | "warning"
    | "success"
    | undefined;
  return typedColor
    ? {
        borderColor: theme.palette.a11y[typedColor],
      }
    : {};
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
          backdrop: "rgba(18, 20, 22, 0.25)",
        },
        a11y: {
          neutral: "#7F8994",
          primary: "#3D8CDB",
          danger: "#C41C1C",
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
          background: theme.palette.background.body,
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant),
          ...a11yInputBorderOutline(theme, ownerState.color),
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
    JoyTextarea: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          background: theme.palette.background.body,
          ...a11yInputBorderOutline(theme, ownerState.color),
        }),
      },
    },
    JoyCheckbox: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          "& .MuiCheckbox-checkbox": a11yInputBorderOutline(
            theme,
            ownerState.color,
          ),
        }),
      },
    },
    JoyRadio: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "& .MuiRadio-radio": {
            ...a11yInputBorderOutline(theme, ownerState.color),
            color: ownerState.color
              ? theme.palette[ownerState.color]["700"]
              : undefined,
          },
        }),
      },
    },
    JoySwitch: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "& .MuiSwitch-track": a11yInputBorderOutline(theme, ownerState.color),
        }),
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
          background: theme.palette.background.body,
          ...a11yInputBorderOutline(theme, ownerState.color),
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
        root: ({ theme, ownerState }) => ({
          background: theme.palette.background.body,
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant),
          ...a11yInputBorderOutline(theme, ownerState.color),
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
    JoyModal: {
      styleOverrides: {
        backdrop: noBackdrop,
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === "md" && {
            height: "2.5rem",
            fontSize: theme.fontSize.md,
            lineHeight: "0.875",
          }),
        }),
      },
    },
  },
});
