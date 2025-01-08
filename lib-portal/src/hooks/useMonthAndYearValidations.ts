/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FieldInputProps, useFormikContext } from "formik";

import { isEmptyString } from "../helpers/guards";
import {
  validateIntegerAnd,
  validatePastMonthAndYear,
  validateRange,
} from "../helpers/validators";
import { OptionalFieldValue } from "../types/form";
import { ValidationRules } from "../types/form";

interface UseMonthAndYearValidationsRulesResult {
  month: ValidationRules<number | null>;
  year: ValidationRules<OptionalFieldValue<number>>;
}

export function useMonthAndYearValidationsRules(
  fieldName: string,
): UseMonthAndYearValidationsRulesResult {
  const { getFieldProps } = useFormikContext();
  const month: FieldInputProps<number | null> = getFieldProps(
    `${fieldName}.month`,
  );
  const year: FieldInputProps<OptionalFieldValue<number>> = getFieldProps(
    `${fieldName}.year`,
  );

  function getRequiredMonth(): string | undefined {
    if (!isEmptyString(year.value) && month.value === null) {
      return "Bitte einen Monat angeben.";
    }
  }

  function getRequiredYear(): string | undefined {
    if (isEmptyString(year.value) && month.value !== null) {
      return "Bitte ein Jahr angeben.";
    }
  }

  function validateMonth(value: number | null): string | undefined {
    if (value !== null && year.value !== "") {
      return validatePastMonthAndYear(year.value, value);
    }
  }

  return {
    month: {
      required: getRequiredMonth(),
      validate: validateMonth,
    },
    year: {
      required: getRequiredYear(),
      validate: validateIntegerAnd(
        validateRange(1900, new Date().getFullYear()),
      ),
    },
  };
}
