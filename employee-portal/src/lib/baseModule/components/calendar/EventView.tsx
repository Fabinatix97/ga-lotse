/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Circle, LocationOn } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import {
  formatDateRange,
  formatDateTimeRange,
} from "@/lib/shared/helpers/dateTime";

import { EventWithCalendarId } from "./calendarMapper";

export function EventView(props: {
  event: EventWithCalendarId;
  calendarColor: string;
}) {
  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1}>
        <Circle sx={{ color: props.calendarColor }} />
        <Typography level="title-md">
          {props.event.timeData.wholeDay
            ? formatDateRange(
                props.event.timeData.start,
                props.event.timeData.end,
              )
            : formatDateTimeRange(
                props.event.timeData.start,
                props.event.timeData.end,
              )}
        </Typography>
      </Stack>
      {isDefined(props.event.metaData.location) && (
        <Stack direction="row" gap={1}>
          <LocationOn />
          <Typography level="title-md">
            {props.event.metaData.location}
          </Typography>
        </Stack>
      )}
      {isDefined(props.event.metaData.description) && (
        <>
          <Divider />
          <Typography>{props.event.metaData.description}</Typography>
        </>
      )}
    </Stack>
  );
}
