/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Circle, LocationOn, WatchLaterOutlined } from "@mui/icons-material";
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
  let description = undefined;
  if (isDefined(props.event.metaData.description)) {
    const match =
      /^Terminblock für (.+?)\. Freie Termine: (.+?)\. Gebuchte Termine: (.+?)\.$/.exec(
        props.event.metaData.description,
      );
    if (match) {
      description = (
        <>
          <Divider />
          <Stack gap={2}>
            <Typography level="title-md" component="h2">
              Terminblock für {match[1]!}
            </Typography>
            <Stack gap={0.5} direction="row" justifyContent="space-between">
              <Typography level="body-md">Freie Termine:</Typography>
              <Typography level="title-md">{match[2]!}</Typography>
            </Stack>
            <Stack gap={0.5} direction="row" justifyContent="space-between">
              <Typography level="body-md">Gebuchte Termine:</Typography>
              <Typography level="title-md">{match[3]!}</Typography>
            </Stack>
          </Stack>
        </>
      );
    } else {
      description = (
        <>
          <Divider />
          <Typography>{props.event.metaData.description}</Typography>
        </>
      );
    }
  }

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1}>
        <WatchLaterOutlined />
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
      {isDefined(props.event.metaData.subject) && (
        <Stack direction="row" gap={1}>
          <Circle sx={{ color: props.calendarColor }} />
          <Typography level="body-md">
            Eintrag von {props.event.metaData.subject}
          </Typography>
        </Stack>
      )}
      {isDefined(props.event.metaData.location) && (
        <Stack direction="row" gap={1}>
          <LocationOn />
          <Typography level="body-md">
            {props.event.metaData.location}
          </Typography>
        </Stack>
      )}
      {description}
    </Stack>
  );
}
