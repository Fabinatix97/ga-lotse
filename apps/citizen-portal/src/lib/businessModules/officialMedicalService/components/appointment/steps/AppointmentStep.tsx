/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/official-medical-service-api";

import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface AppointmentStepProps {
  appointments: ApiAppointment[];
}

export function AppointmentStep({
  appointments,
}: Readonly<AppointmentStepProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <ContentSheet data-testid="appointment-slot-form">
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("appointment.title")}
      </FormSheetTitle>
      <AppointmentPickerSection
        appointments={appointments}
        name="appointment"
        t={t}
      />
    </ContentSheet>
  );
}
