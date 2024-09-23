/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core/index.js";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";

export function AppointmentDayPickerHeader(
  props: Readonly<{
    title: string;
    goToPrevious: CalendarApi["prev"];
    goToNext: CalendarApi["next"];
  }>,
) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap={3}
      flexWrap={"wrap"}
      sx={{ padding: 2 }}
    >
      <Typography
        level="title-md"
        marginRight={"auto"}
        data-testid="selectedMonth"
      >
        {props.title}
      </Typography>
      <Stack direction={"row"} gap={1.5}>
        <IconButton
          sx={{ backgroundColor: "#ffffff" }}
          variant="outlined"
          size="sm"
          onClick={props.goToPrevious}
          aria-label={"Vorheriger Monat"}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          sx={{ backgroundColor: "#ffffff" }}
          variant="outlined"
          size="sm"
          onClick={props.goToNext}
          aria-label={"Nächster Monat"}
        >
          <ChevronRight />
        </IconButton>
      </Stack>
    </Stack>
  );
}
