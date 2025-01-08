/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core/index.js";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";

export function CalendarHeader(props: {
  title: string;
  goToPrevious: CalendarApi["prev"];
  goToNext: CalendarApi["next"];
}) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap={3}
      flexWrap={"wrap"}
    >
      <Typography level="body-md">{props.title}</Typography>
      <Stack direction={"row"} gap={1.5}>
        <IconButton
          color="neutral"
          variant="soft"
          size="sm"
          onClick={props.goToPrevious}
          aria-label={"Vorheriger Monat"}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          color="neutral"
          variant="soft"
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
