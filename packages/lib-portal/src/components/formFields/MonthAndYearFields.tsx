/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined, range } from "remeda";

import { toDateString, toUtcDate } from "../../helpers/dateTime";
import { parseOptionalValue } from "../../helpers/form";
import { isEmptyString } from "../../helpers/guards";
import { useMonthAndYearValidationsRules } from "../../hooks/useMonthAndYearValidations";
import { useTranslation } from "../../i18n/useTranslation";
import { OptionalFieldValue } from "../../types/form";
import {
  SoftRequiredNumberField,
  SoftRequiredSelectObjectField,
} from "../form/fieldVariants";

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

export function parseMonthAndYear(date: Date | undefined): MonthAndYear {
  return {
    month: isDefined(date) ? date.getMonth() : null,
    year: parseOptionalValue(date?.getFullYear()),
  };
}

function useGetMonthLabel() {
  const { i18n } = useTranslation();
  const date = new Date();
  date.setDate(1);

  return (idx: number) => {
    date.setMonth(idx);
    return date.toLocaleString(i18n.language, { month: "long" });
  };
}

export interface MonthAndYearFieldsProps {
  fieldName: string;
  date: MonthAndYear;
  monthLabel?: ReactNode;
  yearLabel?: ReactNode;
  monthValues?: string[];
  testId?: string;
  "aria-labelledby": string;
  softRequired?: boolean;
}

export function MonthAndYearFields(props: MonthAndYearFieldsProps) {
  const { t } = useTranslation();
  const monthOptions: number[] = range(0, 12);
  const getMonthLabel = useGetMonthLabel();

  const { month, year } = useMonthAndYearValidationsRules(props.fieldName);

  return (
    <Stack
      direction="row"
      gap={2}
      data-testid={props.testId}
      role="group"
      aria-labelledby={props["aria-labelledby"]}
    >
      <SoftRequiredSelectObjectField
        name={`${props.fieldName}.month`}
        label={props.monthLabel ?? t("common.month")}
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
        label={props.yearLabel ?? t("common.year")}
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
