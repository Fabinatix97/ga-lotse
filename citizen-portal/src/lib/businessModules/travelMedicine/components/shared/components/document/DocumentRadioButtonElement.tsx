/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentAnamnesisQuestion } from "@eshg/citizen-portal-api/travelMedicine";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Typography, styled } from "@mui/joy";

import { RadioButtonsField } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioButtonsField";
import { useTranslation } from "@/lib/i18n/client";

interface DocumentRadioButtonElementProps {
  name: string;
  label: string;
  setFieldValue: SetFieldValueHelper;
  anamnesisQuestion: ApiDocumentAnamnesisQuestion;
  sectionIndex: number;
  elementIndex: number;
}

export function DocumentRadioButtonElement({
  name,
  label,
  anamnesisQuestion,
  setFieldValue,
  sectionIndex,
  elementIndex,
}: Readonly<DocumentRadioButtonElementProps>) {
  const { t } = useTranslation(["travelMedicine/document"]);
  const StyledLabelComponent = styled(Typography)(({ theme }) => ({
    level: { ...theme.typography["title-md"] },
    fontWeight: "700",
  }));

  return (
    <RadioButtonsField
      name={name}
      label={
        <StyledLabelComponent>
          {sectionIndex + 1}.{elementIndex + 1}. {label}
        </StyledLabelComponent>
      }
      options={[
        { value: "true", label: t("radioButtonYes") },
        { value: "false", label: t("radioButtonNo") },
      ]}
      onChange={async (event) => {
        if (event.target.value === "false" || !event.target.value) {
          if (anamnesisQuestion.subElementText) {
            await setFieldValue(
              "sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].anamnesisQuestion.subElementText.answer",
              "",
            );
          }
          for (
            let i = 0;
            i < anamnesisQuestion.subElementMultiSelect.length;
            i++
          ) {
            await setFieldValue(
              "sections[" +
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
            "sections[" +
              sectionIndex +
              "].sectionElements[" +
              elementIndex +
              "].anamnesisQuestion.answer",
            false,
          );
        } else {
          await setFieldValue(
            "sections[" +
              sectionIndex +
              "].sectionElements[" +
              elementIndex +
              "].anamnesisQuestion.answer",
            true,
          );
        }
      }}
    />
  );
}
