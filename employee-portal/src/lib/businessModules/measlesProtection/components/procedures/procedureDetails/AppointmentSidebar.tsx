/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";

import {
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { SelectObjectField } from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { ApiAppointment } from "@eshg/measles-protection-api";

import { useBookAppointmentForProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBookingApi";
import { useGetFreeAppointments } from "@/lib/businessModules/measlesProtection/api/queries/appointmentBookingApi";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface InitialAppointmentValues {
  appointment: ApiAppointment | null;
}

const initialValues: InitialAppointmentValues = {
  appointment: null,
};

export function AddAppointmentSidebar({ id }: { id: string }) {
  const [open, setOpen] = useSearchParam("add-appointment", "boolean");

  const bookAppointmentForProcedure = useBookAppointmentForProcedure();

  async function handleSubmit(data: typeof initialValues) {
    await bookAppointmentForProcedure.mutateAsync(
      {
        procedureId: id,
        apiBookAppointmentRequest: mapRequiredValue(data.appointment),
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <AppointmentSidebarForm onClose={() => setOpen(false)} isOpen={open} />
    </Formik>
  );
}

export function EditAppointmentSidebar({ id }: { id: string }) {
  const [open, setOpen] = useSearchParam("edit-appointment", "boolean");

  const procedure = useProcedureQuery(id).data;
  const bookAppointmentForProcedure = useBookAppointmentForProcedure();

  if (procedure.type !== "MeaslesProtectionProcedure") {
    return null;
  }

  async function handleSubmit(data: typeof initialValues) {
    await bookAppointmentForProcedure.mutateAsync(
      {
        procedureId: id,
        apiBookAppointmentRequest: mapRequiredValue(data.appointment),
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Formik
      initialValues={{ appointment: procedure.appointment ?? null }}
      onSubmit={handleSubmit}
    >
      <AppointmentSidebarForm onClose={() => setOpen(false)} isOpen={open} />
    </Formik>
  );
}

interface AppointmentSidebarFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function AppointmentSidebarForm({
  onClose,
  isOpen,
}: AppointmentSidebarFormProps) {
  const {
    isSubmitting,
    handleSubmit: handleRawSubmit,
    resetForm,
  } = useFormikContext<typeof initialValues>();

  const handleCancel = useCallback(() => {
    onClose();
    resetForm();
  }, [resetForm, onClose]);

  const freeAppointments =
    useGetFreeAppointments({ enabled: isOpen }).data ?? [];

  return (
    <Sidebar open={isOpen} onClose={onClose}>
      <SidebarForm onSubmit={handleRawSubmit}>
        <SidebarContent title={"Termin wählen"}>
          <Stack gap={3}>
            <SelectObjectField
              name="appointment"
              label="Termin"
              options={freeAppointments}
              getOptionLabel={getAppointmentLabel}
              required="Bitte einen Termin auswählen."
            />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Buchen"
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </SidebarActions>
      </SidebarForm>
    </Sidebar>
  );
}

function getAppointmentLabel(appointment: ApiAppointment) {
  return `${formatDateTime(appointment.start)} - ${formatDateTime(
    appointment.end,
  )}`;
}
