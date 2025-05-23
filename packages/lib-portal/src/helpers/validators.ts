/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  addYears,
  endOfDay,
  isAfter,
  isBefore,
  isFuture,
  isThisMonth,
  isToday,
  parseISO,
  startOfDay,
  subYears,
} from "date-fns";
import { isDefined, isEmpty, isNullish } from "remeda";

import { OptionalFieldValue, Validator } from "../types/form";

import {
  isDateString,
  isDateTimeString,
  isMonthString,
  isTimeString,
} from "./dateTime";
import { isValidEmailString } from "./email";
import { isDict, isEmptyString, isInteger, isStringOnlyDigits } from "./guards";

export function validatePipe<TValue>(
  ...validators: (Validator<TValue> | undefined)[]
) {
  const definedValidators = validators.filter(isDefined);
  return (value: TValue) => {
    for (const validator of definedValidators) {
      const result = validator(value);
      if (isDefined(result)) {
        return result;
      }
    }

    return undefined;
  };
}

export function validateRequired<TValue = string>(message: string) {
  return (value: TValue) => {
    if (Array.isArray(value)) {
      return isEmpty(value) ? message : undefined;
    }

    if (typeof value === "string") {
      return isEmpty(value) ? message : undefined;
    }

    if (isDict(value)) {
      return isEmpty(value as Record<string, unknown>) ? message : undefined;
    }

    return isNullish(value) ? message : undefined;
  };
}

export function validateDate(value: string) {
  if (value === undefined || isEmptyString(value) || isDateString(value)) {
    return undefined;
  }

  return "Bitte ein gültiges Datum angeben.";
}

export function validateTime(value: string) {
  if (!isTimeString(value)) {
    return "Bitte eine gültige Zeit angeben.";
  }

  return undefined;
}

export function validateDateTime(value: OptionalFieldValue<string>) {
  if (isEmptyString(value)) {
    return undefined;
  }

  if (!isDateTimeString(value)) {
    return "Bitte ein gültiges Datum mit Uhrzeit angeben.";
  }

  return undefined;
}

export function validateMonth(value: string) {
  if (value === undefined || isEmptyString(value) || isMonthString(value)) {
    return undefined;
  }

  return "Bitte einen gültigen Monat angeben.";
}

export function validateLength(
  startInclusive: number,
  endInclusive: number,
  message: string,
): Validator<OptionalFieldValue<string>> {
  return (value: OptionalFieldValue<string>) => {
    if (isNullish(value) || isEmpty(value)) {
      return undefined;
    }
    if (
      value.trim().length >= startInclusive &&
      value.trim().length <= endInclusive
    ) {
      return undefined;
    }

    return message;
  };
}

export function validatePastOrTodayDate(message: string): Validator<string> {
  return (value: string) => {
    if (isDateString(value) && !isToday(value) && isFuture(endOfDay(value))) {
      return message;
    }

    return undefined;
  };
}

export function validatePastMonthAndYear(year: number, month: number) {
  const date = new Date(year, month);
  if (!isThisMonth(date) && isFuture(date)) {
    return "Das Datum liegt in der Zukunft.";
  }

  return undefined;
}

export function validateDateOfBirth(value: string) {
  const inputDate = parseISO(value);

  const today = new Date();
  const minDate = subYears(startOfDay(today), 150);
  const maxDate = addYears(endOfDay(today), 1);

  if (isBefore(inputDate, minDate)) {
    return "Das Geburtsdatum darf maximal 150 Jahre in der Vergangenheit liegen.";
  }
  if (isAfter(inputDate, maxDate)) {
    return "Das Geburtsdatum darf maximal ein Jahr in der Zukunft liegen.";
  }

  return undefined;
}

export function validateInteger(value: OptionalFieldValue<number>) {
  if (isEmptyString(value) || isInteger(value)) {
    return undefined;
  }

  return "Bitte eine ganze Zahl angeben.";
}

export function validatePositiveInteger(value: OptionalFieldValue<number>) {
  const isPositiveInteger = isInteger(value) && value > 0;
  if (isEmptyString(value) || isPositiveInteger) {
    return undefined;
  }

  return "Bitte eine positive ganze Zahl angeben.";
}

export function validateNumber(message: string): Validator<string> {
  return (value: string) => {
    if (isEmptyString(value) || isStringOnlyDigits(value)) {
      return undefined;
    }

    return message;
  };
}

export function validateIntegerAnd(
  validator: Validator<OptionalFieldValue<number>>,
) {
  return validatePipe(validateInteger, validator);
}

export function validateRange(
  startInclusive: number,
  endInclusive: number,
): Validator<OptionalFieldValue<number>> {
  return (value: OptionalFieldValue<number>) => {
    if (isEmptyString(value)) {
      return undefined;
    }
    if (value >= startInclusive && value <= endInclusive) {
      return undefined;
    }

    return `Bitte eine Zahl zwischen ${startInclusive} und ${endInclusive} angeben.`;
  };
}

export function validateRegex(
  regex: RegExp,
  errorMessage: string,
): Validator<string> {
  return (value: string) => {
    const trimmed = value.trim();
    if (isEmptyString(trimmed) || regex.test(trimmed)) {
      return undefined;
    }

    return errorMessage;
  };
}

export function validateEmail(message: string): Validator<string> {
  return (value: string) => {
    if (
      value === undefined ||
      isEmptyString(value) ||
      isValidEmailString(value)
    ) {
      return undefined;
    }

    return message;
  };
}

export function validateHexColorCode(message: string): Validator<string> {
  return validateRegex(/^#([A-Fa-f0-9]{6})$/, message);
}
