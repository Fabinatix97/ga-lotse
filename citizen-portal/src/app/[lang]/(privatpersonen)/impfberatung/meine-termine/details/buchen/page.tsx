/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { IdContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { AppointmentPageTitle } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentPageTitle";
import { RebookAppointmentPageContent } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointmentPageContent";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function RebookAppointmentPage() {
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);

  return (
    <PageLayout>
      <PageContent>
        <IdContextProvider>
          <AppointmentPageTitle title={t("header.title")} />
          <RebookAppointmentPageContent />
        </IdContextProvider>
      </PageContent>
    </PageLayout>
  );
}
