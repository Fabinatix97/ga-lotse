/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import { SoftRequiredSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";

import { CheckUpsValues } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { SetAllBooleanWithUnknownSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { BOOLEAN_WITH_UNKNOWN_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import {
  BOOLEAN_SELECT_STYLE,
  BOOLEAN_WITH_UNKNOWN_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";

const CHECKUPS: { name: string; label: string }[] = [
  { name: "u2", label: "U2" },
  { name: "u3", label: "U3" },
  { name: "u4", label: "U4" },
  { name: "u5", label: "U5" },
  { name: "u6", label: "U6" },
  { name: "u7", label: "U7" },
  { name: "u7a", label: "U7a" },
  { name: "u8", label: "U8" },
  { name: "u9", label: "U9" },
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
    <Stack gap={2} data-testid="checkUpsForm">
      <Typography level="title-sm">Vorsorgeuntersuchungen</Typography>
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
