/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import {
  ApiDoctorLetterValue,
  ApiExaminationResultValue,
} from "@eshg/school-entry-api";

import { ExaminationResultValueField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultValueField";
import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import {
  ClickIcd10CodeHandler,
  Icd10CodeField,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/Icd10CodeField";
import { ResponseDoctorLetterField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ResponseDoctorLetterField";
import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
  handleChangeExaminationResultValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";

interface ExaminationWithDiagnosisFieldsProps {
  name: string;
  values: ExaminationWithDiagnosisFieldValues;
  examinationResultLabel: string;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
}

export interface ExaminationWithDiagnosisFieldValues {
  examinationResult: {
    examinationResultValue: OptionalFieldValue<ApiExaminationResultValue>;
    doctorLetterValue: OptionalFieldValue<ApiDoctorLetterValue>;
  };
  icd10Codes: string[];
}

export function isExaminationResultWithoutDiagnosis(
  examinationResultValue: string | null,
) {
  return (
    examinationResultValue !== ApiExaminationResultValue.DoctorLetter &&
    examinationResultValue !== ApiExaminationResultValue.Known
  );
}

export const FIXED_WIDTH_EXAMINATION_RESULT_STYLE: SxProps = {
  ...FIXED_WIDTH_STYLE,
  width: "235px",
};

export function ExaminationWithDiagnosisFields(
  props: ExaminationWithDiagnosisFieldsProps,
) {
  const fieldName = createFieldNameMapper(props.name);

  function onChangeExaminationResultValue(newValue: string | null) {
    handleChangeExaminationResultValue(
      newValue,
      fieldName("examinationResult"),
      props.setFieldValue,
      resetIcd10CodesIfNecessary,
    );
  }

  function resetIcd10CodesIfNecessary(newValue?: string | null) {
    if (newValue && isExaminationResultWithoutDiagnosis(newValue)) {
      void props.setFieldValue(fieldName("icd10Codes"), []);
    }
  }

  return (
    <Stack direction="row" gap={3} data-testid={props.name} flexWrap="wrap">
      <ExaminationResultValueField
        name={fieldName("examinationResult.examinationResultValue")}
        label={<FlexLabel>{props.examinationResultLabel}</FlexLabel>}
        onChange={onChangeExaminationResultValue}
        sx={FIXED_WIDTH_EXAMINATION_RESULT_STYLE}
        renderValue={getAbbreviation}
        softRequired
      />
      <Icd10CodeField
        name={fieldName("icd10Codes")}
        values={props.values.icd10Codes}
        setFieldValue={props.setFieldValue}
        disabled={isExaminationResultWithoutDiagnosis(
          props.values.examinationResult.examinationResultValue,
        )}
        onClickIcd10Code={props.onClickIcd10Code}
      />
      <ResponseDoctorLetterField
        name={fieldName("examinationResult.doctorLetterValue")}
        label="RM"
        examinationResultValue={
          props.values.examinationResult.examinationResultValue
        }
        sx={FIXED_WIDTH_STYLE}
        renderValue={getAbbreviation}
      />
    </Stack>
  );
}
