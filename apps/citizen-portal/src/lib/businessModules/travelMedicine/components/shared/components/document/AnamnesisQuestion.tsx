/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { FieldConfig, FieldInputProps } from "formik";

import { SetFieldValueHelper } from "@eshg/lib-portal";
import { ApiDocumentAnamnesisQuestion } from "@eshg/travel-medicine-api";

import { DocumentMultiSelectElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentMultiSelectElement";
import { DocumentRadioButtonElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentRadioButtonElement";
import { DocumentTextareaElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentTextareaElement";

interface AnamnesisQuestionProps {
  sectionIndex: number;
  sectionElementIndex: number;
  anamnesisQuestion: ApiDocumentAnamnesisQuestion;
  setFieldValue: SetFieldValueHelper;
  getFieldProps: <Value>(
    props: string | FieldConfig<Value>,
  ) => FieldInputProps<Value>;
  parentPath: string;
}

export function AnamnesisQuestion(props: Readonly<AnamnesisQuestionProps>) {
  const anamnesisPath = `${props.parentPath}.anamnesisQuestion`;
  return (
    <>
      <DocumentRadioButtonElement
        name={`${anamnesisPath}.answer`}
        anamnesisPath={anamnesisPath}
        label={props.anamnesisQuestion.questionText}
        setFieldValue={props.setFieldValue}
        anamnesisQuestion={props.anamnesisQuestion}
        elementIndex={props.sectionElementIndex}
        sectionIndex={props.sectionIndex}
        data-testid="document-element-type-question"
      />
      {(
        props.getFieldProps(`${anamnesisPath}.answer`).value as string
      )?.toString() === "true" && (
        <>
          {props.anamnesisQuestion.subElementMultiSelect.length > 0 && (
            <DocumentMultiSelectElement
              anamnesisQuestion={props.anamnesisQuestion}
              elementIndex={props.sectionElementIndex}
              name={`${anamnesisPath}.subElementMultiSelect`}
              parentPath={`${anamnesisPath}`}
            />
          )}
          {props.anamnesisQuestion.subElementText && (
            <Stack
              sx={{
                marginX: 2.5,
              }}
            >
              <DocumentTextareaElement
                name={`${anamnesisPath}.subElementText.answer`}
                label={props.anamnesisQuestion.subElementText.questionText}
              />
            </Stack>
          )}
        </>
      )}
    </>
  );
}
