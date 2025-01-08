/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentSectionElement } from "@eshg/employee-portal-api/travelMedicine";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { FormLabel, styled } from "@mui/joy";

import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";

interface MedicalHistoryRadioButtonElementProps {
  name: string;
  label: string;
  setFieldValue: SetFieldValueHelper;
  element: ApiDocumentSectionElement;
  sectionIndex: number;
  elementIndex: number;
  readOnly?: boolean;
}

export function MedicalHistoryRadioButtonElement({
  name,
  label,
  element,
  setFieldValue,
  sectionIndex,
  elementIndex,
  readOnly = false,
}: Readonly<MedicalHistoryRadioButtonElementProps>) {
  const StyledLabelComponent = styled(FormLabel)(() => ({
    fontSize: 14,
  }));

  return (
    <RadioButtonsField
      name={name}
      label={<StyledLabelComponent>{label}</StyledLabelComponent>}
      data-testid="document-element-type-question"
      options={[
        { value: "true", label: "Ja" },
        { value: "false", label: "Nein" },
      ]}
      onChange={async (value) => {
        if (value === "false" || !value) {
          if (element.anamnesisQuestion!.subElementText) {
            await setFieldValue(
              "medicalHistoryContent.sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].anamnesisQuestion.subElementText.answer",
              "",
            );
          }
          for (
            let i = 0;
            i < element.anamnesisQuestion!.subElementMultiSelect.length;
            i++
          ) {
            await setFieldValue(
              "medicalHistoryContent.sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].anamnesisQuestion.subElementMultiSelect[" +
                i +
                "].answer",
              false,
            );
          }
          await setFieldValue(
            "medicalHistoryContent.sections[" +
              sectionIndex +
              "].sectionElements[" +
              elementIndex +
              "].anamnesisQuestion.answer",
            false,
          );
        } else {
          await setFieldValue(
            "medicalHistoryContent.sections[" +
              sectionIndex +
              "].sectionElements[" +
              elementIndex +
              "].anamnesisQuestion.answer",
            true,
          );
        }
      }}
      disabled={readOnly}
    />
  );
}
