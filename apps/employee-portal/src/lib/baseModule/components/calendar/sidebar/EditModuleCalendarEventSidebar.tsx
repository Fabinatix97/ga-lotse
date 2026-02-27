/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteForever } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useConfirmationDialog,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { FormPlus, useSnackbar } from "@eshg/lib-portal";

import {
  useDeleteCalendarEvent,
  useSubmitCalendarEvent,
} from "@/lib/baseModule/api/mutations/calendar";
import {
  EventFormActions,
  EventFormInputs,
  ModuleEventFormValues,
} from "@/lib/baseModule/components/calendar/EventForm";
import {
  EventWithCalendarId,
  mapModuleEventFormToRequestValues,
  mapModuleEventToFormValues,
} from "@/lib/baseModule/components/calendar/calendarMapper";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function useEditModuleEventSidebar(): UseSidebarResult<EditModuleEventSidebarProps> {
  return useSidebar({
    component: EditModuleEventSidebar,
  });
}

interface EditModuleEventSidebarProps extends DrawerProps {
  event: EventWithCalendarId;
  refetchEvents: () => void;
}

function EditModuleEventSidebar({
  onClose,
  event,
  refetchEvents,
}: EditModuleEventSidebarProps) {
  const submitCalendarEvent = useSubmitCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();

  function saveEvent(
    values: ModuleEventFormValues,
    event: EventWithCalendarId,
  ) {
    submitCalendarEvent.mutate(
      {
        eventId: event.id,
        request: mapModuleEventFormToRequestValues(values),
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Kalendereintrag erfolgreich gespeichert");
          onClose();
          refetchEvents();
        },
      },
    );
  }

  function deleteEvent(event: EventWithCalendarId) {
    deleteCalendarEvent.mutate(
      {
        eventId: event.id,
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Kalendereintrag erfolgreich gelöscht");
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
    <Formik
      initialValues={mapModuleEventToFormValues(event, event.calendarId)}
      validate={validateEndAfterStart}
      onSubmit={(values) => saveEvent(values, event)}
    >
      <FormPlus sx={{ display: "contents" }}>
        <SidebarContent title="Fachmodulkalendereintrag bearbeiten">
          <EventFormInputs subject />
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
      </FormPlus>
    </Formik>
  );
}
