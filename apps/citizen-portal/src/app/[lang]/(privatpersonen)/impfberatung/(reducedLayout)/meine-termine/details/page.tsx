/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { IdContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { AppointmentPageContent } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentPageContent";
import { AppointmentPageTitle } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentPageTitle";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function AppointmentDetailsPage() {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    <PageContent>
      <IdContextProvider>
        <AppointmentPageTitle title={t("header.title")} />
        <AppointmentPageContent />
      </IdContextProvider>
    </PageContent>
  );
}
