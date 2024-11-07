/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useSubmitCalendarEvent } from "@/lib/baseModule/api/mutations/calendar";
import {
  EventForm,
  EventFormActions,
  EventFormInputs,
  EventFormValues,
} from "@/lib/baseModule/components/calendar/EventForm";
import { mapFormToRequestValues } from "@/lib/baseModule/components/calendar/calendarMapper";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function AddAbsenceSidebar({
  open,
  closeSidebar,
  userCalendarId,
  refetchEvents,
}: {
  open: boolean;
  closeSidebar: () => void;
  userCalendarId: string;
  refetchEvents: () => void;
}) {
  const submitCalendarEvent = useSubmitCalendarEvent();
  const snackbar = useSnackbar();

  async function saveEvent(values: EventFormValues) {
    await submitCalendarEvent.mutateAsync(
      {
        request: mapFormToRequestValues(values, "VACATION", userCalendarId),
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Abwesenheit wurde erfolgreich gespeichert");
          closeSidebar();
          refetchEvents();
        },
      },
    );
  }

  return (
    <Sidebar open={open} onClose={closeSidebar}>
      {open && (
        <EventForm onSubmit={(values) => saveEvent(values)}>
          <SidebarContent title={"Neue Abwesenheit"}>
            <EventFormInputs />
          </SidebarContent>
          <SidebarActions>
            <EventFormActions onCancel={closeSidebar} />
          </SidebarActions>
        </EventForm>
      )}
    </Sidebar>
  );
}
