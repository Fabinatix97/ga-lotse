/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { ApiDocumentContent } from "@eshg/travel-medicine-api";

import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface MedicalHistorySidePanel {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  medicalHistory: ApiDocumentContent;
  onRouteBack: () => void;
  focusTitle: () => void;
}

export function MedicalHistorySidePanel(
  props: Readonly<MedicalHistorySidePanel>,
) {
  const { t } = useTranslation(["travelMedicine/medicalHistories"]);

  function goToNextSection() {
    props.setCurrentStep(props.currentStep + 1);
    props.focusTitle();
  }

  function goToPrevSection() {
    props.setCurrentStep(props.currentStep - 1);
    props.focusTitle();
  }

  return (
    <ContentSheet data-testid="medical-history-side-panel">
      <Stack direction="column" gap={2} width="100%">
        {props.currentStep < props.medicalHistory.sections.length - 1 && (
          <Button color="primary" variant="solid" onClick={goToNextSection}>
            {t("sidePanel.nextStep")}
          </Button>
        )}
        {props.currentStep === props.medicalHistory.sections.length - 1 && (
          <Button color="primary" variant="solid" type="submit">
            {t("sidePanel.submitMedicalHistory")}
          </Button>
        )}
        {props.currentStep > 0 && (
          <Button color="neutral" variant="soft" onClick={goToPrevSection}>
            {t("sidePanel.previousStep")}
          </Button>
        )}
        <Button color="neutral" variant="soft" onClick={props.onRouteBack}>
          {t("sidePanel.cancel")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
