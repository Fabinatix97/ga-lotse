/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { ApiDocumentAnamnesisQuestion } from "@eshg/travel-medicine-api";
import { Typography, styled } from "@mui/joy";

import { RadioButtonsField } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioButtonsField";
import { useTranslation } from "@/lib/i18n/client";

interface DocumentRadioButtonElementProps {
  name: string;
  anamnesisPath: string;
  label: string;
  setFieldValue: SetFieldValueHelper;
  anamnesisQuestion: ApiDocumentAnamnesisQuestion;
  sectionIndex: number;
  elementIndex: number;
  "data-testid"?: string;
}

export function DocumentRadioButtonElement({
  name,
  anamnesisPath,
  label,
  anamnesisQuestion,
  setFieldValue,
  sectionIndex,
  elementIndex,
  "data-testid": dataTestId,
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
      data-testid={dataTestId}
      options={[
        { value: "true", label: t("radioButtonYes") },
        { value: "false", label: t("radioButtonNo") },
      ]}
      onChange={async (event) => {
        if (event.target.value === "false" || !event.target.value) {
          if (anamnesisQuestion.subElementText) {
            await setFieldValue(`${anamnesisPath}.subElementText.answer`, "");
          }
          for (
            let i = 0;
            i < anamnesisQuestion.subElementMultiSelect.length;
            i++
          ) {
            await setFieldValue(
              `${anamnesisPath}.subElementMultiSelect[${i}].answer`,
              false,
            );
          }
          await setFieldValue(name, false);
        } else {
          await setFieldValue(name, true);
        }
      }}
    />
  );
}
