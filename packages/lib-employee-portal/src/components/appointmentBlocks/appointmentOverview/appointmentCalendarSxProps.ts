/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export const EVENT_CONTENT_STYLE: SxProps = {
  [".fc-list &"]: {
    color: "a11y.neutral",
  },
  [".fc-timegrid &, [role='tooltip'] &"]: {
    color: "white",
    fontSize: "xs",
    fontWeight: 500,
  },
  [".fc-bg-event &"]: {
    color: "text.primary",
  },
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export function appointmentCalendarSxProps(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.body,

    "--fc-small-font-size": "0.75rem",
    "--fc-today-bg-color": theme.palette.background.level1,
    ".fc": {
      height: "100%",
    },
    ".fc-bg-event": {
      opacity: 1,
      borderRadius: theme.radius.xs,
      margin: "0 2px",
    },
    ".fc-event": {
      padding: 0.75,
      cursor: "pointer",
    },
    ".fc-event-main": {
      overflow: "hidden",
    },
    ".fc th": {
      fontWeight: theme.fontWeight.lg,
    },
    ".fc-day-today": {
      borderBottom: "",
      // a firefox (version below v122) bug,
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=688556

      backgroundClip: "padding-box",
    },
    "tbody tr.fc-scrollgrid-section-body:not(.fc-scrollgrid-section-liquid) .fc-scroller":
      {
        maxHeight: "15vh",
      },
    ".fc-col-header-cell-cushion, a.fc-timegrid-axis-cushion.fc-scrollgrid-shrink-cushion.fc-scrollgrid-sync-inner":
      {
        color: "text.primary",
      },

    // Timegrid view
    ".fc-timegrid": {
      ".fc-scrollgrid-section > *": {
        borderWidth: 0,
      },
      ".fc-scrollgrid": {
        borderWidth: 0,
      },
      ".fc-col-header-cell": {
        padding: 1,
        borderBottom: `2px solid ${theme.palette.divider}`,
      },
      ".fc-col-header th:first-child": {
        borderBottom: `2px solid ${theme.palette.divider}`,
      },
      ".fc-timegrid-slot": {
        height: "3.75rem",
      },
      ".fc-timegrid-slots:focus-visible": {
        outlineColor: theme.palette.focusVisible,
        outlineStyle: "auto",
        outlineOffset: `-${theme.focus.thickness}`,
        outlineWidth: theme.focus.thickness,
      },
      ".fc-timegrid-axis-cushion": {
        paddingX: 1,
        maxWidth: "fit-content",
      },
      ".fc-scrollgrid-section-body .fc-timegrid-axis-cushion": {
        alignSelf: "flex-start",
        textAlign: "right",
      },
      ".fc-scrollgrid-section-body .fc-timegrid-slot-label": {
        verticalAlign: "baseline",
        padding: 0.5,
      },
      ".fc-timegrid-col-events": {
        margin: "0 5px",
      },
      "colgroup col": {
        width: "4rem !important",
      },
    },

    // List view
    ".fc-listMonth-view": {
      border: "none",

      ".fc-list-table ": {
        borderBottomStyle: "inherit",
      },
      ".fc-list-empty": {
        borderRadius: theme.radius.sm,
      },
      ".fc-list-day": {
        position: "relative",
        zIndex: 1,
      },
      ".fc-list-event": {
        height: "3.75rem",
      },
      ".fc-list-event > td": {
        border: "none",
        verticalAlign: "middle",
      },
      ".fc-list-event-time": {
        width: "10rem",
      },
      ".fc-list-day-cushion.fc-cell-shaded": {
        background: theme.palette.background.surface,
        borderBottom: `2px solid ${theme.palette.divider}`,
        textAlign: "left",
        paddingY: 2,
        paddingX: 1,
      },
    },

    // Day view
    ".fc-timeGridDay-view": {
      ".fc-timegrid-col": {
        border: "none",
      },
      // Day view is configure to use multiple columns and therefore requires
      // hiding all but the first column header to emulate the default day view.
      "th.fc-col-header-cell.fc-day:nth-child(n+3)": {
        display: "none",
      },
      // If the first column is fc-day-today, the view is currently showing today's date.
      // In that case, highlight all columns accordingly.
      ".fc-timegrid-col.fc-timegrid-axis + .fc-timegrid-col.fc-day-today": {
        "&, & ~ .fc-timegrid-col.fc-day": {
          backgroundColor: "var(--fc-today-bg-color)",
        },
      },
      ".fc-timegrid-col.fc-day": {
        backgroundColor: "inherit",
      },
    },
  };
}

// Dynamically update view's columns
export function dayViewColumnsSxProps(columnCount: number) {
  return {
    ".fc-timeGridDay-view": {
      [`.fc-timegrid-col.fc-day:nth-child(n+${columnCount + 2})`]: {
        display: "none",
      },
    },
  };
}
