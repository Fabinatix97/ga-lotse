/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { SelectFieldOption } from "@eshg/lib-portal/components/formFields/SelectField";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import {
  ApiDoctorLetterValue,
  ApiExaminationResult,
  ApiExaminationResultValue,
} from "@eshg/school-entry-api";

import { ExaminationResultFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";

export const FIXED_WIDTH_STYLE: SxProps = {
  ".MuiInput-input": { width: "55px" },
  ".MuiSelect-root": { width: "65px" },
};

export function handleChangeExaminationResultValue(
  newValue: string | null,
  examinationResultFieldName: string,
  setFieldValue: SetFieldValueHelper,
  onResetResponse?: (newValue?: string | null) => void,
) {
  const shouldResetResponse =
    newValue !== ApiExaminationResultValue.DoctorLetter;
  void setFieldValue(
    `${examinationResultFieldName}.doctorLetterValue`,
    shouldResetResponse ? "" : ApiDoctorLetterValue.NoReply,
  );
  if (shouldResetResponse && isDefined(onResetResponse)) {
    onResetResponse(newValue);
  }
}

export function getAbbreviation(option: SelectFieldOption<false>) {
  if (option === null) {
    return "";
  }
  if (typeof option.label === "string") return option.label.split(" ")[0];
  return option.label;
}

export function mapToExaminationResultFormValues(
  apiExaminationResult: ApiExaminationResult,
): ExaminationResultFieldsValues {
  return {
    examinationResultValue: parseOptionalValue(
      apiExaminationResult.examinationResultValue,
    ),
    doctorLetterValue: parseOptionalValue(
      apiExaminationResult.doctorLetterValue,
    ),
  };
}
