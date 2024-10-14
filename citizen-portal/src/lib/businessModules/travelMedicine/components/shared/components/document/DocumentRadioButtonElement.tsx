/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistorySectionElement } from "@eshg/citizen-portal-api/travelMedicine";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Typography, styled } from "@mui/joy";

import { RadioButtonsField } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioButtonsField";
import { useTranslation } from "@/lib/i18n/client";

interface DocumentRadioButtonElementProps {
  name: string;
  label: string;
  setFieldValue: SetFieldValueHelper;
  element: ApiMedicalHistorySectionElement;
  sectionIndex: number;
  elementIndex: number;
}

export function DocumentRadioButtonElement({
  name,
  label,
  element,
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
          if (element.elementData.subElementText) {
            await setFieldValue(
              "sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].elementData.subElementText.answer",
              "",
            );
          }
          for (
            let i = 0;
            i < element.elementData.subElementMultiSelect.length;
            i++
          ) {
            await setFieldValue(
              "sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].elementData.subElementMultiSelect[" +
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
              "].elementData.answer",
            false,
          );
        } else {
          await setFieldValue(
            "sections[" +
              sectionIndex +
              "].sectionElements[" +
              elementIndex +
              "].elementData.answer",
            true,
          );
        }
      }}
    />
  );
}
