/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { DeleteForever } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

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
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function EditAbsenceSidebar({
  open,
  closeSidebar,
  refetchEvents,
  event,
}: {
  open: boolean;
  closeSidebar: () => void;
  refetchEvents: () => void;
  event?: EventWithCalendarId;
}) {
  const submitCalendarEvent = useSubmitCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();

  function saveEvent(values: EventFormValues, event: EventWithCalendarId) {
    submitCalendarEvent.mutate(
      {
        eventId: event.id,
        request: mapFormToRequestValues(
          values,
          "VACATION",
          event.calendarId,
          event.showAs,
        ),
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
          closeSidebar();
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
    <Sidebar open={open} onClose={closeSidebar}>
      {open && event && (
        <EventForm
          initialValues={mapEventToFormValues(event)}
          onSubmit={(values) => saveEventWithConfirmation(values, event)}
        >
          <SidebarContent title={"Abwesenheit Ändern"}>
            <EventFormInputs />
          </SidebarContent>
          <SidebarActions>
            <Stack justifyContent={"space-between"} direction={"row"}>
              <Button
                variant="plain"
                color="danger"
                startDecorator={<DeleteForever />}
                onClick={() => deleteEventWithConfirmation(event)}
              >
                Löschen
              </Button>
              <EventFormActions onCancel={closeSidebar} />
            </Stack>
          </SidebarActions>
        </EventForm>
      )}
    </Sidebar>
  );
}
