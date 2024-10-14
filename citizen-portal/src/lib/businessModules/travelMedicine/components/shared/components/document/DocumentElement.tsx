/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistorySectionElement } from "@eshg/citizen-portal-api/travelMedicine";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { FieldConfig, FieldInputProps } from "formik";

import { DocumentMultiSelectElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentMultiSelectElement";
import { DocumentRadioButtonElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentRadioButtonElement";
import { DocumentTextareaElement } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentTextareaElement";

interface DocumentElementProps {
  currentStep: number;
  index: number;
  element: ApiMedicalHistorySectionElement;
  setFieldValue: SetFieldValueHelper;
  getFieldProps: <Value>(
    props: string | FieldConfig<Value>,
  ) => FieldInputProps<Value>;
}

export function DocumentElement(props: Readonly<DocumentElementProps>) {
  return (
    <>
      <DocumentRadioButtonElement
        name={
          "sections[" +
          props.currentStep +
          "].sectionElements[" +
          props.index +
          "].elementData.answer"
        }
        label={props.element.elementData.questionText}
        setFieldValue={props.setFieldValue}
        element={props.element}
        elementIndex={props.index}
        sectionIndex={props.currentStep}
      />
      {(
        props.getFieldProps(
          "sections[" +
            props.currentStep +
            "].sectionElements[" +
            props.index +
            "].elementData.answer",
        ).value as string
      )?.toString() === "true" && (
        <>
          {props.element.elementData.subElementMultiSelect.length > 0 && (
            <DocumentMultiSelectElement
              element={props.element}
              elementIndex={props.index}
              sectionIndex={props.currentStep}
              name={
                "sections[" +
                props.currentStep +
                "].sectionElements[" +
                props.index +
                "].elementData.subElementMultiSelect"
              }
            />
          )}
          {props.element.elementData.subElementText && (
            <Stack
              style={{
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <DocumentTextareaElement
                name={
                  "sections[" +
                  props.currentStep +
                  "].sectionElements[" +
                  props.index +
                  "].elementData.subElementText.answer"
                }
                label={props.element.elementData.subElementText.questionText}
              ></DocumentTextareaElement>
            </Stack>
          )}
        </>
      )}
    </>
  );
}
