/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import { isValidEmailString } from "@eshg/lib-portal/helpers/email";
import { isBlankString, isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isValidURL } from "@eshg/lib-portal/helpers/url";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { endOfDay, isPast } from "date-fns";
import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

import { isInteger } from "@/lib/shared/helpers/guards";

import { isDateTimeString, isTimeString } from "./dateTime";

export function validateTodayOrFutureDate(value: string) {
  if (isDateString(value) && isPast(endOfDay(value))) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
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

export function validateEmail(value: string) {
  if (
    value === undefined ||
    isEmptyString(value) ||
    isValidEmailString(value)
  ) {
    return undefined;
  }

  return "Bitte eine gültige Email angeben.";
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

export function validatePositiveInteger(value: OptionalFieldValue<number>) {
  const isPositiveInteger = isInteger(value) && value > 0;
  if (isEmptyString(value) || isPositiveInteger) {
    return undefined;
  }

  return "Bitte eine positive ganze Zahl angeben.";
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
