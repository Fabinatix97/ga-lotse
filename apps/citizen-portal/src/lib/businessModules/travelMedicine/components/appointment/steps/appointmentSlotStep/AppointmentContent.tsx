/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { useContext, useEffect } from "react";

import { isDateCurrentDateOrGreater } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

import { useGetFreeAppointmentsForCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { AppointmentStepperContext } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointments";
import { NoAppointmentsContent } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointmentsContent";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";

export function AppointmentContent() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();
  const citizenRoutes = useCitizenRoutes();
  const { setShowSidepanel } = useContext(AppointmentStepperContext);

  const freeAppointments = useGetFreeAppointmentsForCitizen(
    values.initialStepAppointmentType as ApiAppointmentType,
  ).data;

  const filteredAppointments = freeAppointments.appointments.filter(
    (appointment) => isDateCurrentDateOrGreater(appointment.start),
  );

  useEffect(() => {
    setShowSidepanel(filteredAppointments.length !== 0);
  }, [filteredAppointments, setShowSidepanel]);

  return (
    <FormSheet data-testid="appointment-slot-content-form">
      {filteredAppointments.length > 0 ? (
        <>
          <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
            {t("appointmentSlotFormContent.title")}
          </FormSheetTitle>
          <AppointmentPickerSection
            appointments={filteredAppointments}
            name="appointment"
            t={t}
          />
        </>
      ) : (
        <NoAppointments>
          <NoAppointmentsContent backButtonLocation={citizenRoutes.overview} />
        </NoAppointments>
      )}
    </FormSheet>
  );
}
