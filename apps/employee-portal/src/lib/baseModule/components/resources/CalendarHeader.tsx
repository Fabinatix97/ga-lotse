/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";

export function CalendarHeader(props: {
  title: string;
  goToPrevious: CalendarApi["prev"];
  goToNext: CalendarApi["next"];
}) {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={3}
      flexWrap="wrap"
    >
      <Typography level="body-md">{props.title}</Typography>
      <Stack direction="row" gap={1.5}>
        <IconButton
          color="neutral"
          variant="soft"
          size="sm"
          aria-label="Vorheriger Monat"
          onClick={props.goToPrevious}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          color="neutral"
          variant="soft"
          size="sm"
          aria-label="Nächster Monat"
          onClick={props.goToNext}
        >
          <ChevronRight />
        </IconButton>
      </Stack>
    </Stack>
  );
}
