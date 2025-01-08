/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import {
  ClickIcd10CodeHandler,
  Icd10CodeField,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/Icd10CodeField";
import { FIXED_WIDTH_BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

interface HandicapWithDiagnosisFieldsProps {
  name: string;
  label: string;
  values: HandicapWithDiagnosisFieldValues;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
  onResetResult?: () => void;
}

export interface HandicapWithDiagnosisFieldValues {
  result: OptionalFieldValue<boolean>;
  icd10Codes: string[];
}

export function HandicapWithDiagnosisFields(
  props: HandicapWithDiagnosisFieldsProps,
) {
  const fieldName = createFieldNameMapper(props.name);

  function handleChangeResult(newValue: OptionalFieldValue<boolean>) {
    if (!newValue) {
      void props.setFieldValue(fieldName("icd10Codes"), []);
      if (props.onResetResult) {
        props.onResetResult();
      }
    }
  }

  return (
    <Stack direction="row" gap={3} data-testid={props.name}>
      <SoftRequiredBooleanSelectField
        name={fieldName("result")}
        label={<FlexLabel>{props.label}</FlexLabel>}
        sx={FIXED_WIDTH_BOOLEAN_SELECT_STYLE}
        onChange={handleChangeResult}
        allowDeselection
        softRequired
      />
      <Icd10CodeField
        name={fieldName("icd10Codes")}
        values={props.values.icd10Codes}
        setFieldValue={props.setFieldValue}
        onClickIcd10Code={props.onClickIcd10Code}
        disabled={!props.values.result}
        softRequired
      />
    </Stack>
  );
}
