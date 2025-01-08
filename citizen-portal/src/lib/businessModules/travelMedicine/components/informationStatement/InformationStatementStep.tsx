/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentSection } from "@eshg/citizen-portal-api/travelMedicine";
import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";

import { DocumentSection } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentSection";
import { SignatureSection } from "@/lib/businessModules/travelMedicine/components/shared/components/document/SignatureSection";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";

interface InformationStatementStepProps {
  section: ApiDocumentSection;
  sectionIndex: number;
}
export function InformationStatementStep({
  section,
  sectionIndex,
}: Readonly<InformationStatementStepProps>) {
  const { currentStep, totalSteps } = useMultiStepForm();

  return (
    <DocumentSection
      sectionIndex={sectionIndex}
      documentSection={section}
      parentPath="informationStatement"
      documentHeader={
        section.sectionTitle && (
          <ContentSheetTitle data-testid="document-section-title">
            {section.sectionTitle}
          </ContentSheetTitle>
        )
      }
      signatureSection={currentStep == totalSteps ? <SignatureSection /> : null}
    />
  );
}
