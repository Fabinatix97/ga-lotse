/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isAfter, isEqual } from "date-fns";
import { useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { isDefined } from "remeda";

import { useGetFreeAppointmentsForCitizen } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { NoAppointmentCard } from "@/lib/businessModules/officialMedicalService/components/appointment/NoAppointmentCard";
import { AppointmentStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/AppointmentStep";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

import { AppointmentFormSidePanel } from "./AppointmentFormSidePanel";

function isDateCurrentDateOrGreater(date: Date) {
  const now = new Date();
  return isEqual(date, now) || isAfter(date, now); //filter out dates before now
}

export function AppointmentStepWrapper() {
  const { setFieldValue, values } = useFormikContext<AppointmentFormValues>();
  const [{ data: freeAppointments }] = useSuspenseQueries({
    queries: [
      useGetFreeAppointmentsForCitizen(
        values.concern.appointmentType as ApiAppointmentType,
      ),
    ],
  });
  const [isInitialDate, setIsInitialDate] = useState(false);

  const filteredAppointments = useMemo(
    () =>
      freeAppointments.appointments.filter((appointment) =>
        isDateCurrentDateOrGreater(appointment.start),
      ),
    [freeAppointments],
  );

  useEffect(() => {
    const firstAppointment = filteredAppointments[0];
    if (isDefined(firstAppointment)) {
      void (async () => {
        await setFieldValue("appointment", {
          start: firstAppointment.start,
          end: firstAppointment.end,
        });
        setIsInitialDate(true);
      })();
    }
  }, [filteredAppointments, setFieldValue]);

  return filteredAppointments.length > 0 ? (
    isInitialDate && (
      <TwoColumnGrid
        content={<AppointmentStep appointments={filteredAppointments} />}
        sidePanel={<AppointmentFormSidePanel />}
      />
    )
  ) : (
    <NoAppointmentCard />
  );
}
