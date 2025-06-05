/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { createFieldNameMapper } from "@eshg/lib-portal";
import { ApiDecibelValue, ApiHertzValue } from "@eshg/school-entry-api";

import { ExaminationFormProps } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationFormProps";
import { SideIndicator } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SideIndicator";
import { TestValuesButtonGroupField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/TestValuesButtonGroupField";

const DECIBEL_VALUE_OPTIONS = Object.values(ApiDecibelValue);
const HERTZ_VALUE_OPTIONS = Object.values(ApiHertzValue);

export function EarForm(props: ExaminationFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  return (
    <Stack direction="row" gap={3} data-testid={props.name}>
      <SideIndicator
        sideIndicator={props.sideIndicator}
        sideIndicatorPosition={props.sideIndicatorPosition}
      />
      <Stack gap={0.5}>
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
