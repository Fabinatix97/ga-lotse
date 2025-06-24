/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";

import { useGetFreeAppointmentsForCitizenAfterCurrentDate } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { NoAppointmentCard } from "@/lib/businessModules/officialMedicalService/components/appointment/NoAppointmentCard";
import { AppointmentStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/AppointmentStep";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

import { AppointmentFormSidePanel } from "./AppointmentFormSidePanel";

export function AppointmentStepWrapper() {
  const citizenRoutes = useCitizenRoutes();
  const { values } = useFormikContext<AppointmentFormValues>();
  const [{ data: freeAppointments }] = useSuspenseQueries({
    queries: [
      useGetFreeAppointmentsForCitizenAfterCurrentDate(
        values.concern.appointmentType || undefined,
      ),
    ],
  });

  return freeAppointments.length > 0 ? (
    <TwoColumnGrid
      content={<AppointmentStep appointments={freeAppointments} />}
      sidePanel={<AppointmentFormSidePanel />}
    />
  ) : (
    <NoAppointmentCard href={citizenRoutes.overview} />
  );
}
