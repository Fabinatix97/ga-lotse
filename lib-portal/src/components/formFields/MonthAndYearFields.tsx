/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { range } from "remeda";

import { toDateString, toUtcDate } from "../../helpers/dateTime";
import { isEmptyString } from "../../helpers/guards";
import { useMonthAndYearValidationsRules } from "../../hooks/useMonthAndYearValidations";
import { useTranslation } from "../../i18n/useTranslation";
import { OptionalFieldValue } from "../../types/form";

import { HorizontalField } from "./HorizontalField";
import { NumberField } from "./NumberField";
import { SelectObjectField } from "./SelectObjectField";

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
}

export function MonthAndYearFields(props: MonthAndYearFieldsProps) {
  const { t } = useTranslation();
  const monthOptions: number[] = range(0, 12);
  const getMonthLabel = useGetMonthLabel();

  const { month, year } = useMonthAndYearValidationsRules(props.fieldName);

  return (
    <Stack direction="row" gap={2} data-testid={props.testId}>
      <SelectObjectField
        name={`${props.fieldName}.month`}
        label={props.monthLabel ?? t("common.month")}
        options={monthOptions}
        getOptionLabel={getMonthLabel}
        component={HorizontalField}
        sx={{ width: "170px" }}
        validate={month.validate}
        required={month.required}
      />
      <NumberField
        name={`${props.fieldName}.year`}
        label={props.yearLabel ?? t("common.year")}
        sx={{ width: "85px" }}
        component={HorizontalField}
        min={1900}
        validate={year.validate}
        required={year.required}
      />
    </Stack>
  );
}
