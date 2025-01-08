/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { ExaminationFormProps } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationFormProps";
import { SideIndicator } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SideIndicator";
import { TestValuesButtonGroupField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/TestValuesButtonGroupField";
import {
  EYE_EXAMINATION_TYPES,
  PERCENTAGE_VALUES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";

const EYE_EXAMINATION_TYPE_OPTIONS = buildEnumOptions(EYE_EXAMINATION_TYPES);
const PERCENTAGE_VALUE_OPTIONS = buildEnumOptions(PERCENTAGE_VALUES);

export function EyeForm(props: ExaminationFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  return (
    <Stack direction="row" gap={2} data-testid={props.name}>
      <SideIndicator
        sideIndicator={props.sideIndicator}
        sideIndicatorPosition={props.sideIndicatorPosition}
      />
      <Stack gap={0.5}>
        {EYE_EXAMINATION_TYPE_OPTIONS.map((eyeExaminationType) => (
          <TestValuesButtonGroupField
            key={eyeExaminationType.value}
            name={fieldName(eyeExaminationType.value)}
            label={eyeExaminationType.label}
            options={PERCENTAGE_VALUE_OPTIONS}
            buttonWidth={60}
          />
        ))}
      </Stack>
    </Stack>
  );
}
