/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { Suspense } from "react";

import {
  ApiAppointment,
  ApiGetCitizenProcedureDetailsResponse,
} from "@eshg/official-medical-service-api";

import { useGetFreeAppointmentsForCitizenAfterCurrentDate } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { NoAppointmentCard } from "@/lib/businessModules/officialMedicalService/components/appointment/NoAppointmentCard";
import { BookAppointment } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointment";
import { BookAppointmentSidePanel } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentSidePanel";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export interface BookAppointmentFormValues {
  appointment?: ApiAppointment;
}

interface BookAppointmentWrapperProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

export function BookAppointmentWrapper(props: BookAppointmentWrapperProps) {
  return (
    <Suspense>
      <InnerBookAppointmentWrapper {...props} />
    </Suspense>
  );
}

function InnerBookAppointmentWrapper({
  procedure,
}: BookAppointmentWrapperProps) {
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const [{ data: freeAppointments }] = useSuspenseQueries({
    queries: [
      useGetFreeAppointmentsForCitizenAfterCurrentDate(
        procedure.appointment?.appointmentType,
      ),
    ],
  });

  return freeAppointments.length > 0 ? (
    <TwoColumnGrid
      content={<BookAppointment appointments={freeAppointments} />}
      sidePanel={<BookAppointmentSidePanel procedure={procedure} />}
    />
  ) : (
    <NoAppointmentCard href={citizenRoutes.personalArea.index(accessCode)} />
  );
}
