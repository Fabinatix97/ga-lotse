/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";

import { ConfirmationSection } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConfirmationSection";
import { OverviewSection } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/OverviewSection";
import { MultiStepFormButtonBar } from "@/lib/businessModules/officialMedicalService/shared/MultiStepFormButtonBar";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function AppointmentFormSidePanel() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const citizenRoutes = useCitizenRoutes();

  const { currentStep, totalSteps } = useMultiStepForm();

  return (
    <ContentSheet
      data-testid={currentStep === totalSteps ? "confirmation-form" : undefined}
    >
      {currentStep !== totalSteps && (
        <OverviewSection
          buttonBar={
            <MultiStepFormButtonBar
              href={citizenRoutes.overview}
              backLabel={t("overview.goBack")}
              cancelLabel={t("overview.cancel")}
              forwardLabel={t("overview.goForward")}
            />
          }
        />
      )}

      {currentStep === totalSteps && (
        <ConfirmationSection
          buttonBar={
            <MultiStepFormButtonBar
              href={citizenRoutes.overview}
              backLabel={t("overview.goBack")}
              cancelLabel={t("overview.cancel")}
              forwardLabel={t("overview.goForward")}
              submitLabel={t("confirmation.submit")}
            />
          }
        />
      )}
    </ContentSheet>
  );
}
