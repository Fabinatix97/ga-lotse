/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMedicalHistoryContent,
  ApiMedicalHistorySection,
} from "@eshg/citizen-portal-api/travelMedicine";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import { DocumentElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentElement";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface DocumentProps {
  currentStep: number;
  documentSection: ApiMedicalHistorySection;
  documentBriefing?: ReactNode;
}

export function DocumentSection(props: Readonly<DocumentProps>) {
  const { setFieldValue, getFieldProps } =
    useFormikContext<ApiMedicalHistoryContent>();

  return (
    <ContentSheet data-testid={`document-section-${props.currentStep}`}>
      {props.currentStep === 0 && props.documentBriefing}
      <Stack gap={4}>
        {props.documentSection.sectionElements.map((element, index) => (
          <Stack gap={2} key={index} data-testid={`document-element-${index}`}>
            <DocumentElement
              currentStep={props.currentStep}
              index={index}
              element={element}
              setFieldValue={setFieldValue}
              getFieldProps={getFieldProps}
            />
          </Stack>
        ))}
      </Stack>
    </ContentSheet>
  );
}
