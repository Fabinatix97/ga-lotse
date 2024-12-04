/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Button } from "@mui/joy";
import { isDefined } from "remeda";

import { EventView } from "@/lib/baseModule/components/calendar/EventView";
import { CalendarInfo } from "@/lib/baseModule/components/calendar/calendarDisplay";
import {
  EventWithCalendarId,
  mapEventTypeToFallbackTitle,
} from "@/lib/baseModule/components/calendar/calendarMapper";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function ViewEventSidebar({
  open,
  closeSidebar,
  event,
  calendars,
}: {
  open: boolean;
  closeSidebar: () => void;
  event?: EventWithCalendarId;
  calendars: CalendarInfo[];
}) {
  return (
    <Sidebar open={open} onClose={closeSidebar}>
      {open && event && (
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
            ></EventView>
          </SidebarContent>
          <SidebarActions>
            {isDefined(event.metaData.procedureId) &&
              isDefined(event.metaData.businessModule) && (
                <InternalLinkButton
                  variant="plain"
                  color="primary"
                  size="sm"
                  href={resolveProcedureDetailsRoute({
                    businessModule: event.metaData.businessModule,
                    procedureId: event.metaData.procedureId,
                  })}
                  aria-label="Zum Vorgang"
                  sx={{ alignSelf: "end" }}
                >
                  Zum Vorgang
                </InternalLinkButton>
              )}
            <Button
              variant="solid"
              color="primary"
              sx={{ alignSelf: "flex-end" }}
              onClick={() => closeSidebar()}
            >
              Schließen
            </Button>
          </SidebarActions>
        </>
      )}
    </Sidebar>
  );
}
