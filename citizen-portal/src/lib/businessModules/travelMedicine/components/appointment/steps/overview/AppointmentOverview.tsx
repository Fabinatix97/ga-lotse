/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { useIsMobile } from "@eshg/lib-portal/hooks/useIsMobile";

import { AppointmentFormButtonBar } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentFormButtonBar";
import { PrivacyPolicyConfirmationSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/PrivacyPolicyConfirmationSection";
import { AppointmentOverviewDetails } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverviewDetails";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentOverview() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { currentStep, totalSteps } = useMultiStepForm();
  const isMobile = useIsMobile();
  const isLastStep = currentStep === totalSteps;

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
