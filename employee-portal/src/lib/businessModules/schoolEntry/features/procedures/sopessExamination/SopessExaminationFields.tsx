/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDoctorLetterValue,
  ApiSopessExaminationResultValue,
} from "@eshg/employee-portal-api/schoolEntry";
import { SoftRequiredSelectField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";

import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import {
  RESPONSE_DOCTOR_LETTER_OPTIONS,
  SOPESS_EXAMINATION_RESULT_OPTIONS,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";

interface SopessExaminationFieldsProps {
  examinationResultName: string;
  examinationResultLabel: string;
  responseName: string;
  examinationResultValue: OptionalFieldValue<ApiSopessExaminationResultValue>;
  setFieldValue: SetFieldValueHelper;
}

export function SopessExaminationFields(props: SopessExaminationFieldsProps) {
  function handleChangeExaminationResult(newValue: string | null) {
    const shouldResetResponse =
      newValue !== ApiSopessExaminationResultValue.DoctorLetter;
    void props.setFieldValue(
      props.responseName,
      shouldResetResponse ? "" : ApiDoctorLetterValue.NoReply,
    );
  }

  return (
    <>
      <SoftRequiredSelectField
        options={SOPESS_EXAMINATION_RESULT_OPTIONS}
        name={props.examinationResultName}
        label={props.examinationResultLabel}
        onChange={handleChangeExaminationResult}
        renderValue={getAbbreviation}
        sx={FIXED_WIDTH_STYLE}
        softRequired
      />
      <SoftRequiredSelectField
        options={RESPONSE_DOCTOR_LETTER_OPTIONS}
        name={props.responseName}
        label="RM"
        renderValue={getAbbreviation}
        sx={FIXED_WIDTH_STYLE}
        disabled={
          props.examinationResultValue !==
          ApiSopessExaminationResultValue.DoctorLetter
        }
        softRequired
      />
    </>
  );
}
