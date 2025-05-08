/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useSubmitCalendarEvent } from "@/lib/baseModule/api/mutations/calendar";
import {
  EventForm,
  EventFormActions,
  EventFormInputs,
  EventFormValues,
} from "@/lib/baseModule/components/calendar/EventForm";
import { mapFormToRequestValues } from "@/lib/baseModule/components/calendar/calendarMapper";

export function useAddAbsenceSidebar(): UseSidebarResult<AddAbsenceSidebarProps> {
  return useSidebar({
    component: AddAbsenceSidebar,
  });
}

interface AddAbsenceSidebarProps extends DrawerProps {
  userCalendarId: string;
  refetchEvents: () => void;
}

function AddAbsenceSidebar({
  onClose,
  userCalendarId,
  refetchEvents,
}: AddAbsenceSidebarProps) {
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
          onClose();
          refetchEvents();
        },
      },
    );
  }

  return (
    <EventForm onSubmit={(values) => saveEvent(values)}>
      <SidebarContent title="Neue Abwesenheit">
        <EventFormInputs />
      </SidebarContent>
      <SidebarActions>
        <EventFormActions onCancel={onClose} />
      </SidebarActions>
    </EventForm>
  );
}
