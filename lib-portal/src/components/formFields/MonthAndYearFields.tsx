/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  SoftRequiredNumberField,
  SoftRequiredSelectObjectField,
} from "../../businessModules/schoolEntry/features/procedures/fieldVariants";
import { toDateString, toUtcDate } from "../../helpers/dateTime";
import { isEmptyString } from "../../helpers/guards";
import {
  validateIntegerAnd,
  validatePastMonthAndYear,
  validateRange,
} from "../../helpers/validators";
import { OptionalFieldValue } from "../../types/form";

import { HorizontalField } from "./HorizontalField";

export interface MonthAndYear {
  month: number | null;
  year: OptionalFieldValue<number>;
}

export function mapMonthAndYear(monthAndYear: MonthAndYear) {
  return monthAndYear.month !== null && !isEmptyString(monthAndYear.year)
    ? toUtcDate(
        toDateString(new Date(monthAndYear.year, monthAndYear.month, 1)),
      )
    : undefined;
}

const MONTH_VALUES = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export interface MonthAndYearFieldsProps {
  fieldName: string;
  date: MonthAndYear;
  monthLabel?: ReactNode;
  yearLabel?: ReactNode;
  monthValues?: string[];
  testId?: string;
  softRequired?: boolean;
}

export function MonthAndYearFields(props: MonthAndYearFieldsProps) {
  const monthValues = props.monthValues ?? MONTH_VALUES;
  const monthOptions: number[] = monthValues.map((_, index) => index);

  function getMonthLabel(monthNumber: number) {
    return isDefined(monthValues.at(monthNumber))
      ? monthValues.at(monthNumber)!
      : "";
  }

  function getRequiredMonth() {
    if (!isEmptyString(props.date.year) && props.date.month === null) {
      return "Bitte einen Monat angeben.";
    }
  }
  function getRequiredYear() {
    if (isEmptyString(props.date.year) && props.date.month !== null) {
      return "Bitte ein Jahr angeben.";
    }
  }

  return (
    <Stack direction="row" gap={2} data-testid={props.testId}>
      <SoftRequiredSelectObjectField
        name={`${props.fieldName}.month`}
        label={props.monthLabel ?? "Monat"}
        options={monthOptions}
        getOptionLabel={getMonthLabel}
        component={HorizontalField}
        sx={{ width: "170px" }}
        validate={(month) => {
          if (month !== null && props.date.year !== "") {
            return validatePastMonthAndYear(props.date.year, month);
          }
        }}
        required={getRequiredMonth()}
        softRequired={props.softRequired}
      />
      <SoftRequiredNumberField
        name={`${props.fieldName}.year`}
        label={props.yearLabel ?? "Jahr"}
        sx={{ width: "85px" }}
        component={HorizontalField}
        min={1900}
        validate={validateIntegerAnd(
          validateRange(1900, new Date().getFullYear()),
        )}
        required={getRequiredYear()}
        softRequired={props.softRequired}
      />
    </Stack>
  );
}
