/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentBookingType } from "@eshg/citizen-portal-api/travelMedicine";

import { useGetProcedureStepAppointmentDetails } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";
import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { AppointmentDetails } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetails";
import { AppointmentDetailsSidePanel } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsSidePanel";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";

export function AppointmentPageContent() {
  const isMobile = useIsMobile();
  const { procedureId, procedureStepId } = useIdContext();
  const { data: appointmentDetails } = useGetProcedureStepAppointmentDetails(
    procedureId,
    procedureStepId,
  );

  return isMobile ? (
    <OneColumnGrid
      contentTop={
        <AppointmentDetails appointmentDetails={appointmentDetails} />
      }
      contentCenter={
        <AppointmentDetailsSidePanel
          hasAccomplishedService={appointmentDetails.hasAccomplishedService}
          isCancelled={
            appointmentDetails.summaryDto.appointmentBookingType ===
            ApiAppointmentBookingType.Cancelled
          }
        />
      }
      contentBottom={null}
    />
  ) : (
    <TwoColumnGrid
      content={<AppointmentDetails appointmentDetails={appointmentDetails} />}
      sidePanel={
        <AppointmentDetailsSidePanel
          hasAccomplishedService={appointmentDetails.hasAccomplishedService}
          isCancelled={
            appointmentDetails.summaryDto.appointmentBookingType ===
            ApiAppointmentBookingType.Cancelled
          }
        />
      }
    />
  );
}
