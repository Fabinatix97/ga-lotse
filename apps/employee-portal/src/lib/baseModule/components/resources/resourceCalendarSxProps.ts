/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Theme } from "@mui/joy";

export function resourceCalendarSxProps(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.body,
    padding: "16px 8px 8px 8px",
    gap: 1,
    minHeight: "286px",
    tr: { height: "36px" },
    ".bubble-event": {
      borderRadius: "16px",
      height: "32px",
      width: "32px",
      margin: "auto",
      cursor: "pointer",
    },
    ".fc .fc-daygrid-day-frame": {
      height: "36px",
      cursor: "pointer",
    },
    ".fc .fc-daygrid-day-top": {
      height: "100%",
      justifyContent: "center",
    },
    ".fc .fc-daygrid-day-number": {
      alignSelf: "center",
      textAlign: "center",
    },
    ".fc .fc-day-today .fc-daygrid-day-top": {
      justifyContent: "center",
    },
    ".fc .fc-day-today .fc-daygrid-day-top .fc-daygrid-day-number": {
      backgroundColor: "#2196F3",
      borderRadius: "16px",
      margin: "-1px 1px 0px 1px",
      fontSize: "16px",
      fontWeight: theme.fontWeight.xl,
      color: theme.palette.common.white,
      height: "32px",
      flexBasis: "32px",
      flexGrow: 0,
    },
    ".fc .fc-col-header-cell-cushion": {
      fontSize: "sm",
      fontWeight: 400,
      lineHeight: "21px",
      color: theme.palette.text.primary,
    },
    ".fc .fc-bg-event": { opacity: 1 },
    "--fc-border-color": theme.palette.background.body,
    "--fc-neutral-bg-color": theme.palette.background.body,
    "--fc-today-bg-color": theme.palette.background.body,
  };
}
