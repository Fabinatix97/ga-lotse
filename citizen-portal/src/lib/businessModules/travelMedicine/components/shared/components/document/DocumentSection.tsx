/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDocumentContent,
  ApiDocumentSection,
} from "@eshg/citizen-portal-api/travelMedicine";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import { AnamnesisQuestion } from "@/lib/businessModules/travelMedicine/components/shared/components/document/AnamnesisQuestion";
import { ConfirmationElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/ConfirmationElement";
import { TextBlock } from "@/lib/businessModules/travelMedicine/components/shared/components/document/TextBlock";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface DocumentProps {
  currentStep: number;
  documentSection: ApiDocumentSection;
  documentBriefing?: ReactNode;
}

export function DocumentSection(props: Readonly<DocumentProps>) {
  const { setFieldValue, getFieldProps } =
    useFormikContext<ApiDocumentContent>();

  return (
    <ContentSheet data-testid={`document-section-${props.currentStep}`}>
      {props.currentStep === 0 && props.documentBriefing}
      <Stack gap={4}>
        {props.documentSection.sectionElements.map((element, index) => (
          <Stack gap={2} key={index} data-testid={`document-element-${index}`}>
            <>
              {element.anamnesisQuestion && (
                <AnamnesisQuestion
                  currentStep={props.currentStep}
                  index={index}
                  anamnesisQuestion={element.anamnesisQuestion}
                  setFieldValue={setFieldValue}
                  getFieldProps={getFieldProps}
                />
              )}
              {element.confirmation && (
                <ConfirmationElement
                  currentStep={props.currentStep}
                  index={index}
                  confirmation={element.confirmation}
                  setFieldValue={setFieldValue}
                />
              )}
              {element.textBlock && <TextBlock textBlock={element.textBlock} />}
            </>
          </Stack>
        ))}
      </Stack>
    </ContentSheet>
  );
}
