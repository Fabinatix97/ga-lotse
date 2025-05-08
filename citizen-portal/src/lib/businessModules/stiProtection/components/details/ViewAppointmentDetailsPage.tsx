/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useTranslation } from "react-i18next";

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { FormDataProvider } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

import {
  AppointmentDetailsContent,
  Information,
} from "./AppointmentDetailsContent";
import { AppointmentDetailsSidePanel } from "./AppointmentDetailsSidePanel";

export function ViewAppointmentDetailsPage() {
  const { t } = useTranslation(["stiProtection/appointmentInfo"]);
  const { data: procedure } = useGetProcedure();
  const titleKey =
    procedure.appointment != null
      ? "header.upcoming_appointment_title"
      : "header.past_appointment_title";

  return (
    <PageLayout>
      <PageContent>
        <FormDataProvider initialData={{ procedure }}>
          <PageTitle
            toolbar={<LogoutButton text={t("translation:common.leave")} />}
          >
            {t(titleKey)}
          </PageTitle>
          <ColumnGrid>
            <AppointmentDetailsContent />
            <AppointmentDetailsSidePanel />
            <Information />
          </ColumnGrid>
        </FormDataProvider>
      </PageContent>
    </PageLayout>
  );
}
