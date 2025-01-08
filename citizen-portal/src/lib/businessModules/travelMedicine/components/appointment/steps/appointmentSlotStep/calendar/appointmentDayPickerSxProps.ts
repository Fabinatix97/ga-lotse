/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Theme } from "@mui/joy";

export function appointmentDayPickerSxProps(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.body,
    tr: { height: "45px" },
    ".fc .fc-daygrid-day-frame": {
      height: "45px",
      cursor: "pointer",
    },
    ".fc .fc-daygrid-day-top": {
      height: "36px",
      justifyContent: "center",
    },
    ".fc .fc-daygrid-day-number": {
      alignSelf: "center",
      textAlign: "center",
    },
    ".fc .fc-daygrid-event-harness": {
      display: "flex",
      justifyContent: "center",
    },
    ".fc .fc-daygrid-event": {
      height: "4px",
      width: "24px",
      borderRadius: "4px",
    },
    ".fc-daygrid-day-events": {
      height: "10px",
    },
    ".fc .fc-day-today .fc-daygrid-day-top": {
      justifyContent: "center",
    },
    ".selected-date .fc-daygrid-day-number": {
      backgroundColor: theme.palette.primary.plainColor,
      borderRadius: "16px",
      margin: "-1px 1px 0px 1px",
      fontSize: "16px",
      fontWeight: theme.fontWeight.xl,
      color: theme.palette.common.white,
      height: "32px",
      flexBasis: "32px",
      flexGrow: 0,
    },
    ".fc table": {
      backgroundColor: theme.palette.background.body,
    },
    ".fc .fc-bg-event": { opacity: 1 },
    "--fc-border-color": theme.palette.background.body,
    "--fc-neutral-bg-color": theme.palette.background.body,
    "--fc-today-bg-color": theme.palette.background.body,
  };
}
