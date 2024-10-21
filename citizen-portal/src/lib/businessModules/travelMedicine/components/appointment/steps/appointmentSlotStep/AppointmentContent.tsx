/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isAfter, isEqual } from "date-fns";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import { useGetFreeAppointmentsForCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointments";
import { NoAppointmentsContent } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointmentsContent";
import { AppointmentPicker } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentPicker";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";

export function AppointmentContent() {
  const { values } = useFormikContext<InitialAppointmentFormValues>();
  const { onShowOverviewChange } = useStepContext();
  const citizenRoutes = useCitizenRoutes();

  const freeAppointments = useGetFreeAppointmentsForCitizen(
    values.initialStepAppointmentType,
  ).data;

  const filteredAppointments = freeAppointments.appointments.filter(
    (appointment) => isDateCurrentDateOrGreater(appointment.start),
  );

  useEffect(() => {
    if (filteredAppointments.length === 0) {
      onShowOverviewChange(false);
    }
  }, [filteredAppointments, onShowOverviewChange]);

  function isDateCurrentDateOrGreater(date: Date) {
    const now = new Date();
    return isEqual(date, now) || isAfter(date, now); //filter out dates that are not at least
  }

  return (
    <>
      {filteredAppointments.length > 0 ? (
        <AppointmentPicker filteredAppointments={filteredAppointments} />
      ) : (
        <NoAppointments>
          <NoAppointmentsContent backButtonLocation={citizenRoutes.overview} />
        </NoAppointments>
      )}
    </>
  );
}
