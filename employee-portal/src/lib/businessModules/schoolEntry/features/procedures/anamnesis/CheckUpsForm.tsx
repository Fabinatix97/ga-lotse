/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { Stack, Typography } from "@mui/joy";

import { CheckUpsValues } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

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

  function setAllCheckUpFields(value: OptionalFieldValue<boolean>) {
    CHECKUPS.forEach(
      (checkUp) => void props.setFieldValue(fieldName(checkUp.name), value),
    );
  }

  return (
    <Stack gap={2} data-testid="checkUpsForm">
      <Typography level="title-sm">Vorsorgeuntersuchungen</Typography>
      <Stack direction="row" gap={4}>
        <SetAllBooleanSelect
          label="Alle"
          onChange={setAllCheckUpFields}
          sx={BOOLEAN_SELECT_STYLE}
        />
        <Stack direction="row" gap={4} flexWrap="wrap">
          {CHECKUPS.map((checkUp) => (
            <SoftRequiredBooleanSelectField
              key={checkUp.name}
              name={fieldName(checkUp.name)}
              label={checkUp.label}
              component={HorizontalField}
              sx={BOOLEAN_SELECT_STYLE}
              softRequired
              allowDeselection
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
