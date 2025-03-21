/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { ApiAppointment } from "@eshg/official-medical-service-api";

import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface BookAppointmentProps {
  appointments: ApiAppointment[];
}

export function BookAppointment({
  appointments,
}: Readonly<BookAppointmentProps>) {
  const { t } = useTranslation(["officialMedicalService/rebookAppointment"]);

  return (
    <ContentSheet data-testid="appointment-slot-form">
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("content.title")}
      </FormSheetTitle>
      <Alert
        title={t("content.infoPanelTitle")}
        message={t("content.infoPanelText")}
        color="primary"
      />
      <AppointmentPickerSection
        appointments={appointments}
        name="appointment"
        t={t}
      />
    </ContentSheet>
  );
}
