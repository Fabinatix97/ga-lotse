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

import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

interface PsychoSocialRiskFieldsProps extends NestedFormProps {
  values: PsychoSocialRiskFieldsValues;
  setFieldValue: SetFieldValueHelper;
}

export interface PsychoSocialRiskFieldsValues {
  family: OptionalFieldValue<boolean>;
  nonCompliance: OptionalFieldValue<boolean>;
  social: OptionalFieldValue<boolean>;
  migration: OptionalFieldValue<boolean>;
  otherRisk: OptionalFieldValue<boolean>;
}

interface BooleanField {
  name: keyof PsychoSocialRiskFieldsValues;
  label: string;
}

const BOOLEAN_FIELDS: BooleanField[] = [
  { name: "family", label: "Familie" },
  { name: "nonCompliance", label: "NonCompl" },
  { name: "social", label: "Sozial" },
  { name: "migration", label: "Migration" },
  { name: "otherRisk", label: "Sonst. Risiko" },
];

export function PsychoSocialRiskFields(props: PsychoSocialRiskFieldsProps) {
  const fieldName = createFieldNameMapper(props.name);

  function setAllPsychSoz(newValue: OptionalFieldValue<boolean>) {
    BOOLEAN_FIELDS.forEach((field) => {
      void props.setFieldValue(fieldName(field.name), newValue);
    });
  }

  return (
    <Stack gap={2} data-testid="psychoSocialRiskFields">
      <Typography level="title-sm">Psy-Soz. Risiko</Typography>
      <Stack direction="row" gap={5} flexWrap="wrap">
        <SetAllBooleanSelect
          label="Alle"
          sx={BOOLEAN_SELECT_STYLE}
          onChange={setAllPsychSoz}
        />
        <Stack direction="row" gap={5} alignItems="center" flexWrap="wrap">
          {BOOLEAN_FIELDS.map((field) => (
            <SoftRequiredBooleanSelectField
              key={field.name}
              name={fieldName(field.name)}
              label={field.label}
              sx={BOOLEAN_SELECT_STYLE}
              allowDeselection
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
