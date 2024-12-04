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
import { useMonthAndYearValidationsRules } from "../../hooks/useMonthAndYearValidations";
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

  const { month, year } = useMonthAndYearValidationsRules(props.fieldName);

  return (
    <Stack direction="row" gap={2} data-testid={props.testId}>
      <SoftRequiredSelectObjectField
        name={`${props.fieldName}.month`}
        label={props.monthLabel ?? "Monat"}
        options={monthOptions}
        getOptionLabel={getMonthLabel}
        component={HorizontalField}
        sx={{ width: "170px" }}
        validate={month.validate}
        required={month.required}
        softRequired={props.softRequired}
      />
      <SoftRequiredNumberField
        name={`${props.fieldName}.year`}
        label={props.yearLabel ?? "Jahr"}
        sx={{ width: "85px" }}
        component={HorizontalField}
        min={1900}
        validate={year.validate}
        required={year.required}
        softRequired={props.softRequired}
      />
    </Stack>
  );
}
