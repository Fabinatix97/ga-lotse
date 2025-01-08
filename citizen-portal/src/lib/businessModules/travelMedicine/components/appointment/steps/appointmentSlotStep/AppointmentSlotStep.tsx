/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentContent } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/AppointmentContent";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentSlotStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { isShowOverview } = useStepContext();

  return (
    <FormSheet data-testid="appointment-slot-content-form">
      <FormSheetTitle
        requiredTitle={isShowOverview ? t("common.requiredTitle") : undefined}
      >
        {t("appointmentSlotFormContent.title")}
      </FormSheetTitle>
      <AppointmentContent />
    </FormSheet>
  );
}
