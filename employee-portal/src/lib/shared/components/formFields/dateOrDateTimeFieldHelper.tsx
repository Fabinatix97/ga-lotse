/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  toDateString,
  toDateTimeString,
} from "@eshg/lib-portal/helpers/dateTime";
import { endOfDay, isBefore, parseISO, startOfDay } from "date-fns";
import { FormikErrors, FormikHelpers } from "formik";

export function mapDateTimeToInput(date: Date, wholeDay: boolean) {
  return wholeDay ? toDateString(date) : toDateTimeString(date);
}

export function mapStartWholeDayRequest(start: string, wholeDay: boolean) {
  const startDate = parseISO(start);
  return wholeDay ? startOfDay(startDate) : startDate;
}

export function mapEndWholeDayRequest(end: string, wholeDay: boolean) {
  const endDate = parseISO(end);
  return wholeDay ? endOfDay(endDate) : endDate;
}

interface StartEndFormValues {
  start: string;
  end: string;
  wholeDay: boolean;
}

export function validateEndAfterStart(
  values: StartEndFormValues,
): FormikErrors<StartEndFormValues> | undefined {
  if (
    isBefore(
      mapEndWholeDayRequest(values.end, values.wholeDay),
      mapStartWholeDayRequest(values.start, values.wholeDay),
    )
  ) {
    return { end: "Enddatum muss nach dem Startdatum liegen." };
  }
}

export function handleWholeDayChange(
  setFieldValue: FormikHelpers<StartEndFormValues>["setFieldValue"],
  values: StartEndFormValues,
) {
  return async () => {
    await setFieldValue(
      "start",
      values.start.length > 0
        ? mapDateTimeToInput(parseISO(values.start), !values.wholeDay)
        : "",
    );
    await setFieldValue(
      "end",
      values.end.length > 0
        ? mapDateTimeToInput(parseISO(values.end), !values.wholeDay)
        : "",
    );
  };
}
