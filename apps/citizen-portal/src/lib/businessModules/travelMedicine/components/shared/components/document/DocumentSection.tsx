/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import {
  ApiDocumentContent,
  ApiDocumentSection,
} from "@eshg/travel-medicine-api";

import { AnamnesisQuestion } from "@/lib/businessModules/travelMedicine/components/shared/components/document/AnamnesisQuestion";
import { ConfirmationElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/ConfirmationElement";
import { TextBlock } from "@/lib/businessModules/travelMedicine/components/shared/components/document/TextBlock";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface DocumentProps {
  sectionIndex: number;
  documentSection: ApiDocumentSection;
  documentHeader?: ReactNode;
  signatureSection?: ReactNode;
  parentPath?: string;
}

export function DocumentSection(props: Readonly<DocumentProps>) {
  const { setFieldValue, getFieldProps } =
    useFormikContext<ApiDocumentContent>();

  const parentpath = props.parentPath ? `${props.parentPath}.` : "";
  const sectionsPath = `${parentpath}sections[${props.sectionIndex}]`;

  return (
    <ContentSheet data-testid={`document-section-${props.sectionIndex}`}>
      {props.documentHeader}
      <Stack gap={4}>
        {props.documentSection.sectionElements.map((element, index) => (
          <Stack key={index} gap={2} data-testid={`document-element-${index}`}>
            <>
              {element.anamnesisQuestion && (
                <AnamnesisQuestion
                  sectionIndex={props.sectionIndex}
                  sectionElementIndex={index}
                  anamnesisQuestion={element.anamnesisQuestion}
                  setFieldValue={setFieldValue}
                  getFieldProps={getFieldProps}
                  parentPath={`${sectionsPath}.sectionElements[${index}]`}
                />
              )}
              {element.confirmation && (
                <ConfirmationElement
                  confirmation={element.confirmation}
                  name={`${sectionsPath}.sectionElements[${index}].confirmation`}
                  parentPath={`${sectionsPath}.sectionElements[${index}]`}
                />
              )}
              {element.textBlock && <TextBlock textBlock={element.textBlock} />}
            </>
          </Stack>
        ))}
        {props.signatureSection}
      </Stack>
    </ContentSheet>
  );
}
