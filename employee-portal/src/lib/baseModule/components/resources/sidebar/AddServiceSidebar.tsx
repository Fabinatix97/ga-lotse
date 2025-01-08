/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDetailedEventWithoutCalendarId } from "@eshg/employee-portal-api/base";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { DeleteForever } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  useDeleteCalendarEvent,
  useSubmitCalendarEvent,
} from "@/lib/baseModule/api/mutations/calendar";
import {
  mapEventToFormValues,
  mapFormToRequestValues,
} from "@/lib/baseModule/components/resources/resourceCalendarMapper";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { DateOrDateTimeField } from "@/lib/shared/components/formFields/DateOrDateTimeField";
import {
  handleWholeDayChange,
  validateEndAfterStart,
} from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export interface AddServiceFormValues {
  reason: string;
  start: string;
  end: string;
  wholeDay: boolean;
}

const emptyValues: AddServiceFormValues = {
  reason: "",
  start: "",
  end: "",
  wholeDay: true,
};

export function AddServiceFormInputs() {
  const { values, setFieldValue } = useFormikContext<AddServiceFormValues>();
  return (
    <Stack flexDirection="column" gap={2}>
      <InputField
        name="reason"
        label="Grund"
        required="Bitte einen Grund angeben."
      />
      <DateOrDateTimeField
        wholeDay={values.wholeDay}
        name="start"
        label="Start"
        required="Bitte ein Startdatum auswählen"
      />
      <DateOrDateTimeField
        wholeDay={values.wholeDay}
        name="end"
        label="Ende"
        required="Bitte ein Enddatum auswählen"
      />
      <CheckboxField
        name="wholeDay"
        label="Ganztägig"
        onChange={handleWholeDayChange(setFieldValue, values)}
      />
    </Stack>
  );
}

export function AddServiceFormActions({ onCancel }: { onCancel: () => void }) {
  const { isSubmitting } = useFormikContext<AddServiceFormValues>();
  return (
    <FormButtonBar
      submitLabel="Speichern"
      submitting={isSubmitting}
      onCancel={onCancel}
    />
  );
}

export function AddServiceForm({
  initialValues,
  onSubmit,
  children,
}: {
  initialValues?: Partial<AddServiceFormValues>;
  onSubmit: (values: AddServiceFormValues) => Promise<void>;
  children: ReactNode;
}) {
  return (
    <Formik
      initialValues={{ ...emptyValues, ...initialValues }}
      onSubmit={onSubmit}
      validate={validateEndAfterStart}
      enableReinitialize
    >
      <FormPlus style={{ display: "contents" }}>{children}</FormPlus>
    </Formik>
  );
}

interface AddServiceSidebarProps extends SidebarWithFormRefProps {
  resourceId: string;
  calendarId: string;
  start: string | undefined;
}

export function useAddServiceSidebar() {
  return useSidebarWithFormRef({
    component: AddServiceSidebar,
  });
}

function AddServiceSidebar(props: AddServiceSidebarProps) {
  const snackbar = useSnackbar();
  const submitCalendarEvent = useSubmitCalendarEvent();

  async function saveService(
    values: AddServiceFormValues,
    event: ApiDetailedEventWithoutCalendarId | undefined,
  ) {
    await submitCalendarEvent.mutateAsync(
      {
        eventId: event?.id,
        request: mapFormToRequestValues(values, props.calendarId),
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Service erfolgreich eingetragen");
          props.onClose(true);
        },
      },
    );
  }

  return (
    <AddServiceForm
      initialValues={
        isDefined(props.start)
          ? {
              start: props.start,
            }
          : undefined
      }
      onSubmit={async (values) => {
        await saveService(values, undefined);
      }}
    >
      <SidebarContent title={"Service eintragen"}>
        <AddServiceFormInputs />
      </SidebarContent>
      <SidebarActions>
        <AddServiceFormActions onCancel={() => props.onClose(false)} />
      </SidebarActions>
    </AddServiceForm>
  );
}

interface EditServiceSidebarProps extends SidebarWithFormRefProps {
  resourceId: string;
  calendarId: string;
  event: ApiDetailedEventWithoutCalendarId;
}

export function useEditServiceSidebar() {
  return useSidebarWithFormRef({ component: EditServiceSidebar });
}

export function EditServiceSidebar(props: EditServiceSidebarProps) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();
  const submitCalendarEvent = useSubmitCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();

  async function saveService(
    values: AddServiceFormValues,
    event: ApiDetailedEventWithoutCalendarId,
  ) {
    await submitCalendarEvent.mutateAsync(
      {
        eventId: event?.id,
        request: mapFormToRequestValues(values, props.calendarId),
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Service erfolgreich eingetragen");
          props.onClose(true);
        },
      },
    );
  }

  function saveServiceWithConfirmation(
    values: AddServiceFormValues,
    event: ApiDetailedEventWithoutCalendarId,
  ): Promise<void> {
    openConfirmationDialog({
      onConfirm: () => saveService(values, event),
    });
    return Promise.resolve();
  }

  async function deleteService(event: ApiDetailedEventWithoutCalendarId) {
    await deleteCalendarEvent
      .mutateAsync(
        {
          eventId: event.id,
        },
        {
          onSuccess: () => {
            snackbar.confirmation("Service erfolgreich gelöscht");
          },
        },
      )
      .then(() => props.onClose());
  }

  function deleteServiceWithConfirmation(
    event: ApiDetailedEventWithoutCalendarId,
  ) {
    openConfirmationDialog({
      title: "Eintrag Löschen?",
      description: "Möchten Sie den Eintrag wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: () => deleteService(event),
      color: "danger",
    });
  }

  return (
    <AddServiceForm
      initialValues={mapEventToFormValues(props.event)}
      onSubmit={(values) => saveServiceWithConfirmation(values, props.event)}
    >
      <SidebarContent title={"Service Eintrag bearbeiten"}>
        <AddServiceFormInputs />
      </SidebarContent>
      <SidebarActions>
        <Stack justifyContent={"space-between"} direction={"row"}>
          <Button
            variant="plain"
            color="danger"
            startDecorator={<DeleteForever />}
            onClick={() => deleteServiceWithConfirmation(props.event)}
          >
            Löschen
          </Button>
          <AddServiceFormActions onCancel={() => props.onClose(false)} />
        </Stack>
      </SidebarActions>
    </AddServiceForm>
  );
}
