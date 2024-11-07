/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDetailedEventWithoutCalendarId } from "@eshg/employee-portal-api/base";
import { Box, Button, Divider, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { UserActivityState } from "@/lib/baseModule/components/resources/ResourceDetail";
import {
  mapEventTypeToFallbackTitle,
  mapResourceCalendarEventColor,
  mapResourceEventDateInfo,
} from "@/lib/baseModule/components/resources/resourceCalendarMapper";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { formatDateToFullReadableStringWithShortenedWeekday } from "@/lib/shared/helpers/dateTime";

export function useEventsViewSidebar() {
  return useSidebar({
    component: EventsViewSidebar,
  });
}

function EventsViewSidebar(props: {
  date: Date;
  events: ApiDetailedEventWithoutCalendarId[];
  setUserActivity: (activity: UserActivityState) => void;
  onClose: () => void;
}) {
  return (
    <SidebarContent
      title={formatDateToFullReadableStringWithShortenedWeekday(props.date)}
    >
      <Stack gap={2}>
        <Divider sx={{ marginBottom: 1 }} />
        {props.events.map((event) => (
          <Stack gap={2} key={event.id}>
            <Stack direction="row" gap={1} alignItems="baseline">
              <Box
                width="0.75rem"
                height="0.75rem"
                bgcolor={mapResourceCalendarEventColor(event.type)}
                borderRadius="lg"
              ></Box>
              <Stack flex={1}>
                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography level="title-md">
                    {isDefined(event.metaData.subject)
                      ? event.metaData.subject
                      : mapEventTypeToFallbackTitle(event.type)}
                  </Typography>
                  {event.type !== "BUSINESS_CASE" && (
                    <Button
                      onClick={() =>
                        props.setUserActivity({
                          type: "edit-service",
                          event,
                        })
                      }
                      variant="plain"
                      sx={{
                        paddingY: 0,
                        minHeight: "24px",
                      }}
                    >
                      Bearbeiten
                    </Button>
                  )}
                </Stack>
                {mapResourceEventDateInfo(event).map((info) => (
                  <Typography level="body-md" color="neutral" key={info}>
                    {info}
                  </Typography>
                ))}
              </Stack>
            </Stack>
            <Divider sx={{ marginTop: 1 }} />
          </Stack>
        ))}
      </Stack>
    </SidebarContent>
  );
}
