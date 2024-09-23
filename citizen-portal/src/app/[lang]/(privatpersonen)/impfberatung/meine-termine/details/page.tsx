/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSearchParams } from "next/navigation";

import { useGetProcedureStepAppointmentDetails } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";
import { AppointmentDetails } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetails";
import { AppointmentDetailsSidePanel } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsSidePanel";
import { AppointmentPageTitle } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentPageTitle";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { useTranslation } from "@/lib/i18n/client";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { Page } from "@/lib/shared/components/layout/page";

export default function AppointmentDetailsPage() {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const procedureId = searchParams.get("procedureId");
  const procedureStepId = searchParams.get("procedureStepId");
  const { data: appointmentDetails } = useGetProcedureStepAppointmentDetails(
    procedureId!,
    procedureStepId!,
  );

  return (
    <Page>
      <AppointmentPageTitle title={t("header.title")} />
      {isMobile ? (
        <OneColumnGrid
          contentTop={
            <AppointmentDetails appointmentDetails={appointmentDetails} />
          }
          contentCenter={
            <AppointmentDetailsSidePanel
              hasAccomplishedService={appointmentDetails.hasAccomplishedService}
            />
          }
          contentBottom={null}
        />
      ) : (
        <TwoColumnGrid
          content={
            <AppointmentDetails appointmentDetails={appointmentDetails} />
          }
          sidePanel={
            <AppointmentDetailsSidePanel
              hasAccomplishedService={appointmentDetails.hasAccomplishedService}
            />
          }
        />
      )}
    </Page>
  );
}
