/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentFormButtonBar } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentFormButtonBar";
import { PrivacyPolicyConfirmationSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/PrivacyPolicyConfirmationSection";
import { AppointmentOverviewDetails } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverviewDetails";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export function AppointmentOverview() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { isLastStep } = useStepContext();
  const isMobile = useIsMobile();

  return (
    <FormSheet data-testid="appointment-overview">
      <FormSheetTitle>{t("appointmentOverviewSection.title")}</FormSheetTitle>
      <AppointmentOverviewDetails />
      {!isMobile ? (
        !isLastStep && <AppointmentFormButtonBar />
      ) : (
        <>
          {isLastStep && <PrivacyPolicyConfirmationSection />}
          <AppointmentFormButtonBar />
        </>
      )}
    </FormSheet>
  );
}
