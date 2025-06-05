/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  OptionalFieldValue,
  SoftRequiredSelectField,
  SoftRequiredSelectFieldProps,
} from "@eshg/lib-portal";
import { ApiExaminationResultValue } from "@eshg/school-entry-api";

import { RESPONSE_DOCTOR_LETTER_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

interface ResponseDoctorLetterFieldProps
  extends Omit<SoftRequiredSelectFieldProps<false>, "options" | "disabled"> {
  examinationResultValue: OptionalFieldValue<ApiExaminationResultValue>;
}

export function ResponseDoctorLetterField(
  props: ResponseDoctorLetterFieldProps,
) {
  const { examinationResultValue, ...selectFieldProps } = props;
  return (
    <SoftRequiredSelectField
      {...selectFieldProps}
      options={RESPONSE_DOCTOR_LETTER_OPTIONS}
      disabled={
        examinationResultValue !== ApiExaminationResultValue.DoctorLetter
      }
      softRequired
    />
  );
}
