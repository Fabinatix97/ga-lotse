/**
 * Copyright 2025 cronn GmbH
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
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/600.css";
import { Theme, extendTheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { isNullish } from "remeda";

import { customBreakpoints } from "./customBreakpoints";

const noBackdrop = {
  backdropFilter: "none",
};

const noBoxShadow = {
  boxShadow: "none",
};

export function multiLineEllipsis(linesToShow = 2) {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: linesToShow,
    lineClamp: String(linesToShow),
    overflow: "hidden",
    textOverflow: "ellipsis",
  } satisfies SxProps;
}

function fixOutlinedHeight(variant?: string, size?: string) {
  return {
    "--Input-minHeight":
      variant === "outlined" && size === "md" ? "2.25rem" : undefined,
  };
}

function fixInputColor(theme: Theme, color?: string) {
  return color === "primary"
    ? {
        color: theme.palette.text.primary,
        "--Input-placeholderColor": theme.palette.primary.plainColor,
      }
    : undefined;
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

function buttonStyle(theme: Theme, variant?: string, color?: string) {
  return {
    ...(variant === "outlined" && {
      background: theme.palette.background.body,
    }),
    ...(color === "neutral" &&
      variant !== "solid" && {
        color: theme.palette.text.primary,
      }),
  };
}

function selectColorStyle(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any,
  variant?: string,
  color?: string,
) {
  if (value === "" || isNullish(value)) {
    return theme.palette.text.secondary;
  } else if (color === "neutral" && variant !== "solid") {
    return theme.palette.text.primary;
  }
  return undefined;
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
        },
        a11y: {
          neutral: "#7F8994",
          primary: "#3D8CDB",
          danger: "#C41C1C",
        },
        text: {
          //neutral.500
          secondary: "#636B74",
          // neutral.400
          tertiary: "#70777E",
          // neutral.800 (text.primary)
          icon: "#171A1C",
        },
      },
    },
  },
  breakpoints: customBreakpoints,
  spacing: 8,
  zIndex: {
    toolbar: 50,
    sidebar: 90,
    sideNavigation: 100,
    header: 500,
  },
  typography: {
    h1: {
      fontSize: "2rem",
      lineHeight: "1.25",
      fontWeight: "600",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "1.25",
      fontWeight: "600",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.25",
      fontWeight: "600",
    },
    /** @deprecated  please adapt existing usages of h4 according to the design.
     * If there are places in the design where this level is required,
     * please contact the design team*/
    h4: {
      fontSize: "1.125rem",
      lineHeight: "1.25",
      fontWeight: "600",
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
      color: "var(--joy-palette-text-primary)",
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
      color: "var(--joy-palette-text-primary)",
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
      color: "var(--joy-palette-text-primary)",
    },
  },
  components: {
    JoyStack: {
      defaultProps: {
        // Use flexbox gap property by default instead of CSS nested selector.
        // See https://mui.com/system/react-stack/#flexbox-gap.
        useFlexGap: true,
      },
    },
    JoyTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          "--TableCell-headBackground": theme.vars.palette.background.surface,
          "--TableCell-paddingY": theme.spacing(1),
          "--TableCell-paddingX": theme.spacing(1.5),
          "--TableRow-stripeBackground": theme.palette.background.surface,
        }),
      },
    },
    JoyModalClose: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.color && {
            color: theme.palette[ownerState.color].plainColor,
          }),
          "--ModalClose-radius": theme.radius.sm,
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
        }),
      },
    },
    JoyDrawer: {
      styleOverrides: {
        backdrop: noBackdrop,
        content: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.body,
        }),
      },
    },
    JoyModal: {
      styleOverrides: {
        backdrop: noBackdrop,
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
          [`& .MuiRadio-root label, & .MuiCheckbox-label`]: {
            fontWeight: 400,
            fontSize: theme.fontSize.md,
          },
        }),
      },
      defaultProps: {
        size: "md",
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
    JoyInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant, ownerState.size),
          ...fixInputColor(theme, ownerState.color),
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
          ...noBoxShadow,
          ...a11yInputBorderOutline(theme, ownerState.color),
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
        root: ({ theme, ownerState }) => ({
          // Placeholder color is overwritten here to comply with WCAG AA contrast requirements
          // Note: this color is hard to differentiate from the filled color (primary),
          // it is recommended to use labels instead of placeholders where possible.
          color: selectColorStyle(
            ownerState.value,
            ownerState.variant,
            ownerState.color,
          ),
          ...a11yInputBorderOutline(theme, ownerState.color),
          "--Select-placeholderOpacity": 1,
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant, ownerState.size),
          ...fixInputColor(theme, ownerState.color),
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
        root: ({ ownerState, theme }) => ({
          ...noBoxShadow,
          ...fixOutlinedHeight(ownerState.variant, ownerState.size),
          ...fixInputColor(theme, ownerState.color),
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
    JoySheet: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          background:
            ownerState.variant === "outlined"
              ? theme.vars.palette.background.body
              : undefined,
          borderRadius: theme.radius.lg,
          padding: theme.spacing(2),
          boxShadow: "none",
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...buttonStyle(theme, ownerState.variant, ownerState.color),
        }),
        startDecorator: ({ theme }) => ({
          ".MuiSvgIcon-root": {
            width: theme.spacing(3),
            height: theme.spacing(3),
          },
        }),
      },
    },
    JoyIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...buttonStyle(theme, ownerState.variant),
        }),
      },
    },
    JoyMenuButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...buttonStyle(theme, ownerState.variant),
        }),
      },
    },
    JoyListItemButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "--variant-plainDisabledColor":
            theme.palette.neutral.softDisabledColor,
          "& span": ownerState.disabled && {
            color: theme.palette.neutral.softDisabledColor,
          },
        }),
      },
    },
    JoyToggleButtonGroup: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.color === "primary" && {
            ".MuiButton-variantOutlined": {
              color: "var(--joy-palette-primary-600)",
            },
          }),
          ...(ownerState.variant === "tabs" && {
            ".MuiButton-variantTabs": {
              backgroundColor: theme.palette.background.level1,
              "--ButtonGroup-separatorColor": "#636B744D",
              "&[aria-pressed=true]": {
                zIndex: 2,
                backgroundColor: theme.palette.primary.solidBg,
                color: "white",
                "&[data-first-child]": {
                  borderLeft: `1px solid ${theme.palette.primary.solidBg}`,
                },
              },
              "&[aria-pressed=false]": {
                fontWeight: 400,
                "&:hover": {
                  zIndex: 1,
                },
              },
            },
          }),
        }),
      },
    },
    JoyCheckbox: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          "&.Mui-disabled": {
            label: {
              color: ownerState.disabled
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
            },
          },
          "& .MuiCheckbox-checkbox": a11yInputBorderOutline(
            theme,
            ownerState.color,
          ),
        }),
        label: ({ theme }) => ({
          fontWeight: 400,
          fontSize: theme.fontSize.md,
        }),
      },
    },
  },
});
