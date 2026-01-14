/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";

import { FormPlus, formatDate, formatPersonName } from "@eshg/lib-portal";

import { Appointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { SchoolEntryProcedure } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";
import { useUpdateAppointmentAsCitizen } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryCitizenApi";
import { UpdateAppointmentContent } from "@/lib/businessModules/schoolEntry/pages/appointment/update-appointment/UpdateAppointmentContent";
import { UpdateAppointmentSidePanel } from "@/lib/businessModules/schoolEntry/pages/appointment/update-appointment/UpdateAppointmentSidePanel";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

interface AppointmentFormValues {
  newAppointment: Appointment | undefined;
}

interface UpdateAppointmentFormProps {
  procedure: SchoolEntryProcedure;
  freeAppointments: Appointment[];
}

export function UpdateAppointmentForm(props: UpdateAppointmentFormProps) {
  const { t } = useTranslation(["schoolEntry/updateAppointment"]);
  const childName = formatPersonName(props.procedure.child);
  const dateOfBirth = formatDate(props.procedure.child.dateOfBirth);

  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const updateAppointment = useUpdateAppointmentAsCitizen();

  async function handleSubmit(values: AppointmentFormValues) {
    if (values.newAppointment) {
      await updateAppointment.mutateAsync({
        newAppointment: values.newAppointment,
      });
      router.push(citizenRoutes.appointment.index(undefined));
    }
  }

  return (
    <Formik
      initialValues={{ newAppointment: undefined } as AppointmentFormValues}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <FormPlus aria-label={t("title")}>
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
