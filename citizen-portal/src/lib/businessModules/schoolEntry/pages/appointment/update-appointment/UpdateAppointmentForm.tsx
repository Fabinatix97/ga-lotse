/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { Appointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { SchoolEntryProcedure } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";
import { useUpdateAppointmentAsCitizen } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryCitizenApi";
import { UpdateAppointmentContent } from "@/lib/businessModules/schoolEntry/pages/appointment/update-appointment/UpdateAppointmentContent";
import { UpdateAppointmentSidePanel } from "@/lib/businessModules/schoolEntry/pages/appointment/update-appointment/UpdateAppointmentSidePanel";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

interface AppointmentFormValues {
  newAppointment: Appointment | undefined;
}

interface UpdateAppointmentFormProps {
  procedure: SchoolEntryProcedure;
  freeAppointments: Appointment[];
}

export function UpdateAppointmentForm(props: UpdateAppointmentFormProps) {
  const childName = formatPersonName(props.procedure.child);
  const dateOfBirth = formatDate(props.procedure.child.dateOfBirth);

  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const updateAppointment = useUpdateAppointmentAsCitizen();

  async function handleSubmit(values: AppointmentFormValues) {
    if (values.newAppointment) {
      await updateAppointment
        .mutateAsync({ newAppointment: values.newAppointment })
        .catch();
      router.push(citizenRoutes.appointment.index(undefined));
    }
  }

  return (
    <Formik
      initialValues={{ newAppointment: undefined } as AppointmentFormValues}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <FormPlus>
          <TwoColumnGrid
            content={
              <UpdateAppointmentContent
                newAppointment={values.newAppointment}
                appointmentChangesByCitizenLeft={
                  props.procedure.appointmentChangesByCitizenLeft
                }
                freeAppointments={props.freeAppointments}
                setFieldValue={setFieldValue}
              />
            }
            sidePanel={
              <UpdateAppointmentSidePanel
                childName={childName}
                dateOfBirth={dateOfBirth}
                submitting={isSubmitting}
                appointment={values.newAppointment}
              />
            }
          />
        </FormPlus>
      )}
    </Formik>
  );
}
