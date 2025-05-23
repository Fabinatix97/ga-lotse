/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { Alert } from "@eshg/lib-portal";
import { ApiAppointment } from "@eshg/travel-medicine-api";

import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function RebookAppointment({
  appointments,
}: Readonly<{
  appointments: ApiAppointment[];
}>) {
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);
  return (
    <ContentSheet data-testid="rebook-appointment-content-form">
      <FormSheetTitle requiredTitle={t("content.requiredTitle")}>
        {t("content.title")}
      </FormSheetTitle>
      <Alert
        title={t("content.infoPanelTitle")}
        message={t("content.infoPanelText")}
        color="primary"
      />
      <Stack data-testid="appointment-picker">
        <AppointmentPickerSection
          appointments={appointments}
          name="appointment"
          t={t}
        />
      </Stack>
    </ContentSheet>
  );
}
