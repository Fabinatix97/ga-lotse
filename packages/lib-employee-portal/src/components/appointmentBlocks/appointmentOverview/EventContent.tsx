/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventContentArg } from "@fullcalendar/core/index.js";
import { Tooltip, Typography, TypographyProps } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { isNonNullish } from "remeda";

import { EVENT_CONTENT_STYLE } from "./appointmentCalendarSxProps";
import { AppointmentViewTypes } from "./appointmentViews";
import { formatTimeSlotRange } from "./helpers";

interface EventContentProps {
  info: EventContentArg;
}

export function TimeGridEventContent({ info }: EventContentProps) {
  const { start, end } = info.event;
  const showSrDescription =
    info.event.display !== "background" &&
    info.view.type === AppointmentViewTypes.TimeGridDay &&
    isNonNullish(start) &&
    isNonNullish(end);
  const description = showSrDescription
    ? `, ${formatTimeSlotRange({ start, end })} Uhr`
    : "";

  return (
    <Tooltip
      arrow
      placement="bottom"
      title={<EventContent>{info.event.title}</EventContent>}
    >
      <EventContent>
        {info.event.title}
        {!!description && (
          <Typography sx={visuallyHidden}>{description}</Typography>
        )}
      </EventContent>
    </Tooltip>
  );
}

export function ListEventContent({ info }: EventContentProps) {
  return (
    <EventContent
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      {info.event.title}
    </EventContent>
  );
}

function EventContent(props: TypographyProps) {
  return (
    <Typography role="button" tabIndex={0} sx={EVENT_CONTENT_STYLE} {...props}>
      {props.children}
    </Typography>
  );
}
