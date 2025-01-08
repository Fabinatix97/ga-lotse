/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentContent } from "@eshg/citizen-portal-api/travelMedicine";
import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { Button } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface InformationStatementSidePanel {
  informationStatement: ApiDocumentContent;
  onRouteBack: () => void;
}

export function InformationStatementPanel(
  props: Readonly<InformationStatementSidePanel>,
) {
  const { t } = useTranslation(["travelMedicine/informationStatements"]);
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();

  return (
    <ContentSheet data-testid="information-statement-side-panel">
      {currentStep < totalSteps && (
        <Button color="primary" variant="solid" onClick={goForward}>
          {t("sidePanel.nextStep")}
        </Button>
      )}
      {currentStep === totalSteps && (
        <Button color="primary" variant="solid" type="submit">
          {t("sidePanel.submitInformationStatement")}
        </Button>
      )}
      {currentStep > 1 && (
        <Button color="neutral" variant="soft" onClick={goBack}>
          {t("sidePanel.previousStep")}
        </Button>
      )}
      <Button color="neutral" variant="soft" onClick={props.onRouteBack}>
        {t("sidePanel.cancel")}
      </Button>
    </ContentSheet>
  );
}
