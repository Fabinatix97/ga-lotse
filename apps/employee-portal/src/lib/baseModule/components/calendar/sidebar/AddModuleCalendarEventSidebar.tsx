/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";

import { ApiModuleCalendar } from "@eshg/base-api";
import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { FormPlus, SelectField, useSnackbar } from "@eshg/lib-portal";

import { useSubmitCalendarEvent } from "@/lib/baseModule/api/mutations/calendar";
import {
  EventFormActions,
  EventFormInputs,
  ModuleEventFormValues,
  emptyValues,
} from "@/lib/baseModule/components/calendar/EventForm";
import { mapModuleEventFormToRequestValues } from "@/lib/baseModule/components/calendar/calendarMapper";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export function useAddModuleEventSidebar(): UseSidebarResult<AddModuleEventSidebarProps> {
  return useSidebar({
    component: AddAbsenceSidebar,
  });
}

interface AddModuleEventSidebarProps extends DrawerProps {
  calendars: ApiModuleCalendar[];
  refetchEvents: () => void;
}

function AddAbsenceSidebar({
  onClose,
  refetchEvents,
  calendars,
}: AddModuleEventSidebarProps) {
  const submitCalendarEvent = useSubmitCalendarEvent();
  const snackbar = useSnackbar();

  async function saveEvent(values: ModuleEventFormValues) {
    await submitCalendarEvent.mutateAsync(
      {
        request: mapModuleEventFormToRequestValues(values),
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Eintrag wurde erfolgreich gespeichert");
          onClose();
          refetchEvents();
        },
      },
    );
  }
  const options = calendars.map((calendar) => ({
    value: calendar.calendarId,
    label: businessModuleNames[calendar.businessModule],
  }));

  return (
    <Formik
      initialValues={{
        ...emptyValues,
        wholeDay: false,
        subject: "",
        calendarId: "",
      }}
      validate={validateEndAfterStart}
      onSubmit={(values) => saveEvent(values)}
    >
      <FormPlus sx={{ display: "contents" }}>
        <SidebarContent title="Neuer Fachmodulkalendereintrag">
          <Stack gap={2}>
            <SelectField
              name="calendarId"
              label="Fachmodul"
              options={options}
              required="Bitte ein Fachmodul auswählen."
            />
            <EventFormInputs subject />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <EventFormActions<ModuleEventFormValues> onCancel={onClose} />
        </SidebarActions>
      </FormPlus>
    </Formik>
  );
}
