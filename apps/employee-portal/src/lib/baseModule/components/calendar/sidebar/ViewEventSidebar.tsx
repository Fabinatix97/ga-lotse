/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { EventView } from "@/lib/baseModule/components/calendar/EventView";
import { CalendarInfo } from "@/lib/baseModule/components/calendar/calendarDisplay";
import {
  EventWithCalendarId,
  mapEventTypeToFallbackTitle,
} from "@/lib/baseModule/components/calendar/calendarMapper";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";

export function useViewEventSidebar(): UseSidebarResult<ViewEventSidebarProps> {
  return useSidebar({
    component: ViewEventSidebar,
  });
}

interface ViewEventSidebarProps extends DrawerProps {
  event: EventWithCalendarId;
  calendars: CalendarInfo[];
}

function ViewEventSidebar({
  event,
  calendars,
  onClose,
}: ViewEventSidebarProps) {
  return (
    <>
      <SidebarContent
        title={
          isDefined(event.metaData.subject)
            ? event.metaData.subject
            : mapEventTypeToFallbackTitle(event.type)
        }
      >
        <EventView
          event={event}
          calendarColor={
            calendars.find((calendar) => calendar.id === event.calendarId)!
              .color
          }
        />
      </SidebarContent>
      <SidebarActions>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="solid" color="primary" onClick={() => onClose()}>
            Schließen
          </Button>
          {isDefined(event.metaData.procedureId) &&
            isDefined(event.metaData.businessModule) && (
              <InternalLinkButton
                variant="plain"
                color="primary"
                size="sm"
                sx={{ marginLeft: "auto" }}
                href={resolveProcedureDetailsRoute({
                  businessModule: event.metaData.businessModule,
                  procedureId: event.metaData.procedureId,
                })}
                aria-label="Zum Vorgang"
              >
                Zum Vorgang
              </InternalLinkButton>
            )}
        </Stack>
      </SidebarActions>
    </>
  );
}
