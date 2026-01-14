/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentFormButtonBar } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentFormButtonBar";
import { PrivacyPolicyConfirmationSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/PrivacyPolicyConfirmationSection";
import { FormSheet } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";

export function ConfirmationSection() {
  const { t } = useTranslation(["travelMedicine/forms"]);

  return (
    <FormSheet data-testid="confirmation-content-form">
      <ContentSheetTitle>{t("confirmationSection.title")}</ContentSheetTitle>
      <PrivacyPolicyConfirmationSection />
      <AppointmentFormButtonBar />
    </FormSheet>
  );
}
