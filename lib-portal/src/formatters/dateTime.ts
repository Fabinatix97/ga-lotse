/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { Nullable } from "../types/utility";

const DATE_FORMAT = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

const TIME_FORMAT = {
  hour: "2-digit",
  minute: "2-digit",
} satisfies Intl.DateTimeFormatOptions;

export function formatDate(date: Nullable<Date>, locale?: string) {
  if (isNullish(date)) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, DATE_FORMAT).format(date);
}

export function formatDateTime(date: Nullable<Date>, locale?: string) {
  if (isNullish(date)) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    ...DATE_FORMAT,
    ...TIME_FORMAT,
  }).format(date);
}

export function formatTime(date: Nullable<Date>, locale?: string) {
  if (isNullish(date)) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, TIME_FORMAT).format(date);
}
