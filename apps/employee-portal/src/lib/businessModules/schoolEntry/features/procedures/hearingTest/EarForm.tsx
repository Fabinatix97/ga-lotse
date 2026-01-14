/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { groupBy } from "remeda";

import { createFieldNameMapper, useBaseField } from "@eshg/lib-portal";
import { ApiDecibelValue, ApiHertzValue } from "@eshg/school-entry-api";

import { ExaminationFormProps } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationFormProps";
import { SideIndicator } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SideIndicator";
import {
  TestValuesButtonGroup,
  TestValuesButtonGroupField,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/TestValuesButtonGroupField";

const DECIBEL_VALUE_OPTIONS = Object.values(ApiDecibelValue);
const HERTZ_VALUE_OPTIONS = Object.values(ApiHertzValue);

export function EarForm(props: ExaminationFormProps) {
  const fieldName = createFieldNameMapper(props.name);
  const field = useBaseField<Record<ApiHertzValue, ApiDecibelValue | null>>({
    name: props.name,
  });

  const alleValue =
    Object.keys(
      groupBy(
        HERTZ_VALUE_OPTIONS.map((it) => field.input.value[it]),
        (it) => it ?? undefined,
      ),
    ).length === 1
      ? (Object.values(field.input.value)[0] ?? undefined)
      : undefined;

  return (
    <Stack
      direction="row"
      gap={3}
      data-testid={props.name}
      role="group"
      aria-labelledby={`ear-indicator-label-${props.sideIndicator}`}
    >
      <SideIndicator
        sideIndicator={props.sideIndicator}
        sideIndicatorPosition={props.sideIndicatorPosition}
        id={`ear-indicator-label-${props.sideIndicator}`}
      />
      <Stack gap={0.5}>
        <TestValuesButtonGroup
          label="Alle"
          variant="outlined"
          color="primary"
          options={DECIBEL_VALUE_OPTIONS}
          buttonWidth={73}
          value={alleValue}
          onChange={(value) => {
            const newValue = HERTZ_VALUE_OPTIONS.every(
              (it) => field.input.value[it] === value,
            )
              ? null
              : value;
            void field.helpers.setValue({
              250: newValue,
              500: newValue,
              1000: newValue,
              2000: newValue,
              4000: newValue,
              6000: newValue,
              8000: newValue,
            });
          }}
        />
        {HERTZ_VALUE_OPTIONS.map((value) => (
          <TestValuesButtonGroupField
            key={value}
            name={fieldName(value)}
            label={`${value} Hz`}
            options={DECIBEL_VALUE_OPTIONS}
            buttonWidth={72}
          />
        ))}
      </Stack>
    </Stack>
  );
}
