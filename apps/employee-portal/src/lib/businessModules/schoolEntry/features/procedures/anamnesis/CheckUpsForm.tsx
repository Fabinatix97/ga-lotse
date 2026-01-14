/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import {
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
  SoftRequiredSelectField,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { CheckUpsValues } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { SetAllBooleanWithUnknownSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { BOOLEAN_WITH_UNKNOWN_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import {
  BOOLEAN_SELECT_STYLE,
  BOOLEAN_WITH_UNKNOWN_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

const CHECKUPS: { name: string; label: string }[] = [
  { name: "u2", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_2 },
  { name: "u3", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_3 },
  { name: "u4", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_4 },
  { name: "u5", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_5 },
  { name: "u6", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_6 },
  { name: "u7", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_7 },
  { name: "u7a", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_7_A },
  { name: "u8", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_8 },
  { name: "u9", label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_U_9 },
];

interface CheckUpsFormProps extends NestedFormProps {
  setFieldValue: SetFieldValueHelper;
  values: CheckUpsValues;
}

export function CheckUpsForm(props: CheckUpsFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  function setAllCheckUpFields(value: OptionalFieldValue<string>) {
    CHECKUPS.forEach(
      (checkUp) => void props.setFieldValue(fieldName(checkUp.name), value),
    );
  }

  return (
    <Stack
      gap={2}
      data-testid="checkUpsForm"
      role="group"
      aria-labelledby="vorsorgeuntersuchungen-label"
    >
      <Typography
        level="title-sm"
        component="h2"
        id="vorsorgeuntersuchungen-label"
      >
        Vorsorgeuntersuchungen
      </Typography>
      <Stack direction="row" gap={4}>
        <SetAllBooleanWithUnknownSelect
          label="Alle"
          sx={BOOLEAN_SELECT_STYLE}
          onChange={setAllCheckUpFields}
        />
        <Stack direction="row" gap={4} flexWrap="wrap">
          {CHECKUPS.map((checkUp) => (
            <SoftRequiredSelectField
              key={checkUp.name}
              name={fieldName(checkUp.name)}
              label={checkUp.label}
              options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
              sx={BOOLEAN_WITH_UNKNOWN_STYLE}
              softRequired
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
