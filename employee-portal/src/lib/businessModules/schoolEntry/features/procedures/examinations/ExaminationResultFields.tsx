/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  createFieldNameMapper,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import {
  ApiDoctorLetterValue,
  ApiExaminationResultValue,
} from "@eshg/school-entry-api";
import { Grid } from "@mui/joy";
import { isDefined } from "remeda";

import { ExaminationResultValueField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultValueField";
import { ResponseDoctorLetterField } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ResponseDoctorLetterField";
import { handleChangeExaminationResultValue } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";

export interface ExaminationResultFieldsValues {
  examinationResultValue: OptionalFieldValue<ApiExaminationResultValue>;
  doctorLetterValue: OptionalFieldValue<ApiDoctorLetterValue>;
}

interface ExaminationResultFieldsProps {
  examinationResultLabel: string;
  name: string;
  values: ExaminationResultFieldsValues;
  setFieldValue: SetFieldValueHelper;
  onResetResponse?: () => void;
}

export function mapExaminationResultValues(
  values: ExaminationResultFieldsValues,
) {
  return {
    examinationResultValue: mapOptionalValue(values.examinationResultValue),
    doctorLetterValue: mapOptionalValue(values.doctorLetterValue),
  };
}

export function ExaminationResultFields(props: ExaminationResultFieldsProps) {
  const fieldName = createFieldNameMapper(props.name);
  function onChangeExaminationResultValue(newValue: string | null) {
    handleChangeExaminationResultValue(
      newValue,
      props.name,
      props.setFieldValue,
      props.onResetResponse,
    );
  }

  function onChangeDoctorLetterValue(value: string) {
    if (
      isDefined(props.onResetResponse) &&
      (value === ApiDoctorLetterValue.NotConfirmed ||
        value === ApiDoctorLetterValue.NoReply)
    ) {
      props.onResetResponse();
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid xs={6}>
        <ExaminationResultValueField
          name={fieldName("examinationResultValue")}
          label={props.examinationResultLabel}
          orientation="vertical"
          softRequired
          onChange={onChangeExaminationResultValue}
        />
      </Grid>
      <Grid xs={6}>
        <ResponseDoctorLetterField
          name={fieldName("doctorLetterValue")}
          label={`RM ${props.examinationResultLabel}`}
          examinationResultValue={props.values.examinationResultValue}
          orientation="vertical"
          onChange={onChangeDoctorLetterValue}
        />
      </Grid>
    </Grid>
  );
}
