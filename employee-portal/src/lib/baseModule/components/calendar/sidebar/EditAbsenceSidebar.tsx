/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteForever } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useConfirmationDialog,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useDeleteCalendarEvent,
  useSubmitCalendarEvent,
} from "@/lib/baseModule/api/mutations/calendar";
import {
  EventForm,
  EventFormActions,
  EventFormInputs,
  EventFormValues,
} from "@/lib/baseModule/components/calendar/EventForm";
import {
  EventWithCalendarId,
  mapEventToFormValues,
  mapFormToRequestValues,
} from "@/lib/baseModule/components/calendar/calendarMapper";

export function useEditAbsenceSidebar(): UseSidebarResult<EditAbsenceSidebarProps> {
  return useSidebar({
    component: EditAbsenceSidebar,
  });
}

interface EditAbsenceSidebarProps extends DrawerProps {
  refetchEvents: () => void;
  event: EventWithCalendarId;
}

function EditAbsenceSidebar({
  onClose,
  refetchEvents,
  event,
}: EditAbsenceSidebarProps) {
  const submitCalendarEvent = useSubmitCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();

  function saveEvent(values: EventFormValues, event: EventWithCalendarId) {
    submitCalendarEvent.mutate(
      {
        eventId: event.id,
        request: mapFormToRequestValues(values, "VACATION", event.calendarId),
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

  function saveEventWithConfirmation(
    values: EventFormValues,
    event: EventWithCalendarId,
  ) {
    openConfirmationDialog({
      onConfirm: () => saveEvent(values, event),
    });
    return Promise.resolve();
  }

  function deleteEvent(event: EventWithCalendarId) {
    deleteCalendarEvent.mutate(
      {
        eventId: event.id,
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Abwesenheit wurde erfolgreich gelöscht");
          onClose();
          refetchEvents();
        },
      },
    );
  }

  function deleteEventWithConfirmation(event: EventWithCalendarId) {
    openConfirmationDialog({
      title: "Eintrag Löschen?",
      description: "Möchten Sie den Eintrag wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: () => deleteEvent(event),
      color: "danger",
    });
  }

  return (
    <EventForm
      initialValues={mapEventToFormValues(event)}
      onSubmit={(values) => saveEventWithConfirmation(values, event)}
    >
      <SidebarContent title="Abwesenheit Ändern">
        <EventFormInputs />
      </SidebarContent>
      <SidebarActions>
        <Stack justifyContent="space-between" direction="row">
          <Button
            variant="plain"
            color="danger"
            startDecorator={<DeleteForever />}
            onClick={() => deleteEventWithConfirmation(event)}
          >
            Löschen
          </Button>
          <EventFormActions onCancel={onClose} />
        </Stack>
      </SidebarActions>
    </EventForm>
  );
}
