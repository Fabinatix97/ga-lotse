/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import {
  BOOLEAN_SELECT_STYLE,
  FIXED_WIDTH_BOOLEAN_SELECT_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";

export interface SocioEducationalFieldsValues {
  reIntroduction: OptionalFieldValue<boolean>;
  schoolCounselling: OptionalFieldValue<boolean>;
  motorPromotion: OptionalFieldValue<boolean>;
  educationalAdvice: OptionalFieldValue<boolean>;
  languageAdvice: OptionalFieldValue<boolean>;
  nutritionalAdvice: OptionalFieldValue<boolean>;
  vaccinationAdvice: OptionalFieldValue<boolean>;
  socialService: OptionalFieldValue<boolean>;
  otherSupport: OptionalFieldValue<boolean>;
  infoLetter: OptionalFieldValue<boolean>;
}

interface SocioEducationalFieldsProps extends NestedFormProps {
  values: SocioEducationalFieldsValues;
  setFieldValue: SetFieldValueHelper;
}

interface BooleanField {
  name: keyof SocioEducationalFieldsValues;
  label: string;
}

const BOOLEAN_FIELD_GROUPS: BooleanField[][] = [
  [
    { name: "reIntroduction", label: "Sprechstunde" },
    { name: "languageAdvice", label: "Sprachförderung" },
    { name: "socialService", label: "Sozialdienst" },
  ],
  [
    { name: "schoolCounselling", label: "Schulberatung" },
    { name: "nutritionalAdvice", label: "Ernährungsber." },
    { name: "otherSupport", label: "Sonstige Hilfen" },
  ],
  [
    { name: "motorPromotion", label: "Motorikförderung" },
    { name: "vaccinationAdvice", label: "Impfberatung" },
    { name: "infoLetter", label: "Schulinfobrief" },
  ],
  [{ name: "educationalAdvice", label: "Erziehungsber." }],
];

export function SocioEducationalFields(props: SocioEducationalFieldsProps) {
  const fieldName = createFieldNameMapper(props.name);

  function setAllSocioEducational(newValue: OptionalFieldValue<boolean>) {
    BOOLEAN_FIELD_GROUPS.forEach((booleanFields) => {
      booleanFields.forEach((field) => {
        void props.setFieldValue(fieldName(field.name), false);
      });
    });
    void props.setFieldValue(fieldName("infoLetter"), newValue);
  }

  return (
    <Stack gap={2} data-testid="socioEducationalFields">
      <Typography level="title-sm">SozPäd Leistung</Typography>
      <Stack direction="row" gap={5} alignItems="flex-start" flexWrap="wrap">
        <SetAllBooleanSelect
          label={<FlexLabel>Maßnahmen</FlexLabel>}
          onChange={setAllSocioEducational}
          sx={BOOLEAN_SELECT_STYLE}
        />
        <Stack gap={3} direction="row" flexWrap="wrap">
          {BOOLEAN_FIELD_GROUPS.map((booleanFields, index) => (
            <Stack gap={1} key={index}>
              {booleanFields.map((field) => (
                <SoftRequiredBooleanSelectField
                  key={field.name}
                  name={fieldName(field.name)}
                  label={<FlexLabel>{field.label}</FlexLabel>}
                  sx={FIXED_WIDTH_BOOLEAN_SELECT_STYLE}
                  allowDeselection
                  softRequired
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
