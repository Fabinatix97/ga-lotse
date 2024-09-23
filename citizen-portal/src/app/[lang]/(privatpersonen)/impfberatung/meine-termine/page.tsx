/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { useGetProcedureAppointments } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";
import { AppointmentOverviewSheet } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentOverviewSheet";
import { AppointmentPageTitle } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentPageTitle";
import {
  OverviewAppointmentTypes,
  TypeSwitchButtons,
} from "@/lib/businessModules/travelMedicine/components/viewAppointment/TypeSwitchButtons";
import { useTranslation } from "@/lib/i18n/client";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { Page } from "@/lib/shared/components/layout/page";

export default function AppointmentOverviewPage() {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);
  const procedureAppointmentData = useGetProcedureAppointments().data;
  const [overviewAppointmentType, setOverviewAppointmentType] = useState(
    procedureAppointmentData.openAppointments.length > 0
      ? OverviewAppointmentTypes.UPCOMING
      : OverviewAppointmentTypes.PAST,
  );

  return (
    <Page>
      <AppointmentPageTitle title={t("header.title")} />
      <TypeSwitchButtons
        overviewAppointmentType={overviewAppointmentType}
        setOverviewAppointmentType={setOverviewAppointmentType}
      />
      <GridColumnStack>
        {overviewAppointmentType === OverviewAppointmentTypes.UPCOMING ? (
          <AppointmentOverviewSheet
            procedureId={procedureAppointmentData.procedureId}
            overviewAppointmentType={OverviewAppointmentTypes.UPCOMING}
            appointments={procedureAppointmentData.openAppointments}
          />
        ) : (
          <AppointmentOverviewSheet
            procedureId={procedureAppointmentData.procedureId}
            overviewAppointmentType={OverviewAppointmentTypes.PAST}
            appointments={procedureAppointmentData.closedAppointments}
          />
        )}
      </GridColumnStack>
    </Page>
  );
}
