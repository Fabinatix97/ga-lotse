/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { endOfDay, isPast } from "date-fns";
import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

import {
  OptionalFieldValue,
  isBlankString,
  isDateString,
  isEmptyString,
  validatePipe,
  validatePositiveInteger,
} from "@eshg/lib-portal";
import { isValidURL } from "@eshg/lib-portal/helpers/url";

import { isInteger } from "@/lib/shared/helpers/guards";

export function validateTodayOrFutureDate(value: string) {
  if (isDateString(value) && isPast(endOfDay(value))) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
}

export function validateURL(value: string) {
  if (value === undefined || isEmptyString(value) || isValidURL(value)) {
    return undefined;
  }

  return "Bitte eine gültige URL angeben.";
}

export function validateNonNegativeInteger(value: OptionalFieldValue<number>) {
  const isNonNegativeInteger = isInteger(value) && value >= 0;
  if (isEmptyString(value) || isNonNegativeInteger) {
    return undefined;
  }

  return "Bitte eine nicht-negative ganze Zahl angeben.";
}

export function validatePositiveNumberWithAtMostTwoDecimalDigits(
  value: OptionalFieldValue<number>,
) {
  if (isEmptyString(value)) {
    return undefined;
  }
  if (value <= 0) {
    return "Bitte eine positive Zahl angeben.";
  }
  const stringRepresentation = value.toString();
  const positionOfSeparator = stringRepresentation.indexOf(".");
  const numberOfDecimalDigits =
    stringRepresentation.length - positionOfSeparator - 1;
  if (positionOfSeparator > -1 && numberOfDecimalDigits > 2) {
    return "Bitte höchstens zwei Nachkommastellen angeben.";
  }
  return undefined;
}

export function validateNonNegativeNumberWithAtMostTwoDecimalDigits(
  value: OptionalFieldValue<number>,
) {
  if (value === undefined || isEmptyString(value)) {
    return undefined;
  }
  if (value < 0) {
    return "Bitte eine nicht-negative Zahl angeben.";
  }
  const stringRepresentation = value.toString();
  const positionOfSeparator = stringRepresentation.indexOf(".");
  const numberOfDecimalDigits =
    stringRepresentation.length - positionOfSeparator - 1;
  if (positionOfSeparator > -1 && numberOfDecimalDigits > 2) {
    return "Bitte höchstens zwei Nachkommastellen angeben.";
  }
  return undefined;
}

export function validateFieldArray<TItem>(
  items: TItem[],
  validateFn: (item: TItem) => FormikErrors<TItem>,
) {
  const arrayErrors = items.map(validateFn);

  if (arrayErrors.every((itemErrors) => isEmpty(itemErrors))) {
    return undefined;
  }

  return arrayErrors;
}

export function validateMatches(otherValue: string, errorMessage: string) {
  return (value: string) => {
    if (value === otherValue) {
      return undefined;
    }

    return errorMessage;
  };
}

export function validateBatchId(value: string) {
  if (!value) {
    return;
  }

  value = value.replaceAll(/\s{2,}/g, " ").trim();
  const validPattern = /^[A-Z0-9\-_#*~\s]*$/i;

  if (value.length > 0 && value.length < 3) {
    return "Die Chargennummer muss mindestens 3 Zeichen enthalten";
  }
  if (value.length > 200) {
    return "Die Chargennummer darf maximal 200 Zeichen enthalten";
  }
  if (!validPattern.test(value)) {
    return "Die Chargennummer darf nur diese Sonderzeichen enthalten: -_#*~";
  }
}

export function validateRequiredBatchId(value: string) {
  if (!value || isBlankString(value)) {
    return "Bitte geben Sie eine Charge an";
  } else {
    return validateBatchId(value);
  }
}

export const APPOINTMENT_DURATION_MIN_LENGTH = 1;
export const APPOINTMENT_DURATION_MAX_LENGTH = 480;

export function validateAppointmentDuration(value: OptionalFieldValue<number>) {
  return validatePipe(validatePositiveInteger, () => {
    let validationMessage;

    if (!isEmptyString(value) && value > APPOINTMENT_DURATION_MAX_LENGTH) {
      validationMessage = "Die Termindauer darf maximal 480 Minuten sein";
    }

    return validationMessage;
  })(value);
}
