/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SoftRequiredNumberField } from "@eshg/lib-portal/components/form/fieldVariants";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { YearField } from "@eshg/lib-portal/components/formFields/YearField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { FormLabel, Stack, Typography } from "@mui/joy";

import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";
import { isInteger } from "@/lib/shared/helpers/guards";

import { AnamnesisFormValues, TEXT_INPUT_STYLE } from "./AnamnesisForm";

const LABEL_TEXT_STYLE = { fontSize: "12px" };

function validateBirthWeight(value: OptionalFieldValue<number>) {
  if (isEmptyString(value)) {
    return undefined;
  }
  if (
    !(isInteger(value) && ((value >= 300 && value <= 6000) || value === 9999))
  ) {
    return "Ungültiger Wert";
  }
}

interface BirthDataAndChildInformationProps {
  values: AnamnesisFormValues;
  setFieldValue: SetFieldValueHelper;
}

export function BirthDataAndChildInformationForm(
  props: BirthDataAndChildInformationProps,
) {
  const developmentInfo = createFieldNameMapper("developmentInfo");
  const additionalChildInfo = createFieldNameMapper("additionalChildInfo");

  const numberOfSiblings = props.values.additionalChildInfo.numberOfSiblings;

  function handleChange(siblings: OptionalFieldValue<number>) {
    const birthYearsCount =
      props.values.additionalChildInfo.siblingsBirthYears.length;
    if (siblings !== "" && siblings < birthYearsCount) {
      for (let i = siblings; i < birthYearsCount; i++) {
        void props.setFieldValue(
          additionalChildInfo(`siblingsBirthYears.${i}`),
          undefined,
        );
      }
    }
  }

  return (
    <Stack gap={2}>
      <Typography level="title-sm">Geburt/Informationen zum Kind</Typography>
      <Stack direction="row" gap={4} flexWrap="wrap">
        <Stack direction="row" gap={2}>
          <SoftRequiredNumberField
            name={developmentInfo("birthWeight")}
            label="Gewicht"
            validate={validateBirthWeight}
            min={300}
            max={9999}
            sx={{ width: "100px" }}
            softRequired
          />
          <FormLabel sx={LABEL_TEXT_STYLE}>in g</FormLabel>
          <InfoIconTooltipButton
            infoText="(300 - 6000, 9999 - unbekannt)"
            tooltipColor="success"
            title="Hinweis Gewicht"
          />
        </Stack>
        <BooleanSelectField
          name={developmentInfo("gestationalAge")}
          label="Schwangerschaftsdauer regelrecht"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <BooleanSelectField
          name={developmentInfo("developmentConspicuities")}
          label="Besonderheiten in der Entwicklung"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <BooleanSelectField
          name={developmentInfo("infancyConspicuities")}
          label="Besonderheiten der Säuglings- und Kleinkinderzeit"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
      </Stack>
      <Stack direction="row" gap={4} flexWrap="wrap">
        <InputField
          name={additionalChildInfo("responsiblePhysician")}
          label="Hausarzt:in"
          type="text"
          component={HorizontalField}
          sx={{
            ".MuiFormLabel-root": { width: "80px" },
            ...TEXT_INPUT_STYLE,
          }}
        />
        <SoftRequiredNumberField
          name={additionalChildInfo("numberOfSiblings")}
          label="Anzahl Geschwister / im Haushalt lebende Kinder"
          min={0}
          sx={{ width: "80px" }}
          onChange={handleChange}
          softRequired
        />
        {!isEmptyString(numberOfSiblings) &&
          Array.from(Array(numberOfSiblings).keys()).map((index) => (
            <YearField
              name={additionalChildInfo(`siblingsBirthYears.${index}`)}
              label={`Geburtsjahr Geschwisterkind ${index + 1}`}
              key={index}
              component={HorizontalField}
              min={1900}
              max={new Date().getFullYear()}
              sx={{ width: "90px" }}
            />
          ))}
      </Stack>
    </Stack>
  );
}
