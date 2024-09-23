/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Theme } from "@mui/joy";

import { CalendarViewType, CalendarViewTypes } from "./calendarViews";

export function calendarSxProps(theme: Theme, view: CalendarViewType) {
  return {
    backgroundColor: theme.palette.background.body,

    ".fc-scrollgrid-section > *": {
      borderWidth: 0,
    },
    ".fc-scrollgrid": {
      borderWidth: 0,
    },
    ".fc-col-header-cell": {
      padding: 1,
      borderBottom: `2px solid ${theme.palette.divider}`,
      textAlign: view === CalendarViewTypes.DayGridMonth ? "right" : "center",
    },
    ".fc th": {
      fontWeight: theme.fontWeight.lg,
    },
    ".fc-col-header-cell:first-child": {
      borderRadius: `${theme.radius.sm} 0px 0px 0px`,
    },
    ".fc-col-header-cell:last-child": {
      borderRadius: `0px ${theme.radius.sm} 0px 0px`,
    },
    ".fc-day-today": {
      borderBottom:
        view === CalendarViewTypes.DayGridMonth
          ? `4px solid ${theme.palette.primary.solidBg}`
          : "",
      // a firefox (version below v122) bug,
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=688556

      backgroundClip: "padding-box",
    },
    ".fc-day-today .fc-daygrid-day-number": {
      fontWeight: theme.fontWeight.lg,
    },
    "tbody tr.fc-scrollgrid-section-body:not(.fc-scrollgrid-section-liquid) .fc-scroller":
      {
        maxHeight: "15vh",
      },
    ".fc-daygrid-day": {
      paddingTop: 0.25,
      paddingRight: 0.5,
    },
    "--fc-today-bg-color": theme.palette.background.level1,
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
    },
    ".fc-col-header-cell-cushion, a.fc-timegrid-axis-cushion.fc-scrollgrid-shrink-cushion.fc-scrollgrid-sync-inner":
      {
        color: "text.primary",
      },
    ".fc-event-time, .fc-event-title": {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    ".fc-scrollgrid-section-body .fc-timegrid-axis-cushion": {
      alignSelf: "flex-start",
      textAlign: "right",
    },
    ".fc-scrollgrid-section-body .fc-timegrid-slot-label": {
      verticalAlign: "baseline",
      padding: 0.5,
    },
    ".fc-col-header th:first-child": {
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
    ".fc-timegrid-divider.fc-cell-shaded": {
      background: theme.palette.divider,
    },
    ".fc-list-day-cushion.fc-cell-shaded": {
      background: theme.palette.background.body,
      borderBottom: `2px solid ${theme.palette.divider}`,
      textAlign: "left",
      paddingY: 2,
      paddingX: 1,
    },
    "colgroup col": {
      width: "4rem !important",
    },
    ".fc .fc-timegrid-axis-cushion": {
      maxWidth: "fit-content",
    },
    ".fc-event": {
      paddingX: 1,
    },
    "--fc-small-font-size": "0.75rem",
    ".fc-event-title": {
      fontWeight: theme.fontWeight.md,
    },
    ".fc-daygrid-dot-event": {
      paddingX: view === CalendarViewTypes.DayGridMonth ? 0 : 1,
    },
    ".fc-list": {
      borderWidth: 0,
    },
    ".fc-list-event": {
      height: "3.75rem",
    },
    ".fc-list-event > td": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    ".fc-list-event > * .fc-list-event-dot": {
      verticalAlign: "middle",
    },
    ".fc-list-event-time": {
      width: "10rem",
    },
    ".fc-list-table ": {
      borderBottomStyle: "inherit",
    },
  };
}
