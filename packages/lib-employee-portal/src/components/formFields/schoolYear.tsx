/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteProps } from "@mui/joy";
import { isNullish } from "remeda";

import {
  BaseField,
  CustomAutocomplete,
  FieldProps,
  OptionalFieldValue,
  isEmptyString,
  useBaseField,
} from "@eshg/lib-portal";

import { formatSchoolYear } from "../../utils/formatters";

interface SchoolYearAutocompleteProps
  extends Omit<
    AutocompleteProps<number, false, false, false>,
    "options" | "getOptionLabel"
  > {
  range?: YearRange;
}

interface YearRange {
  numberOfYearsInPast: number;
  numberOfYearsInFuture: number;
}

const DEFAULT_RANGE: YearRange = {
  numberOfYearsInPast: 5,
  numberOfYearsInFuture: 5,
};

export function SchoolYearAutocomplete(props: SchoolYearAutocompleteProps) {
  const yearRange = props.range ?? DEFAULT_RANGE;
  const schoolYearOptions = generateSchoolYears(
    new Date().getFullYear(),
    yearRange,
  );
  return (
    <CustomAutocomplete
      {...props}
      options={addValueIfNecessary(props.value, schoolYearOptions)}
      getOptionLabel={getSchoolYearLabel}
    />
  );
}

interface SchoolYearFieldProps extends FieldProps<OptionalFieldValue<number>> {
  range?: YearRange;
}

export function SchoolYearField(props: SchoolYearFieldProps) {
  const field = useBaseField<OptionalFieldValue<number>>(props);

  const value = isEmptyString(field.input.value) ? null : field.input.value;

  return (
    <BaseField
      label={props.label}
      required={field.required}
      error={field.error}
      helperText={field.helperText}
    >
      <SchoolYearAutocomplete
        name={props.name}
        value={value}
        range={props.range}
        onChange={(_, newValue) => {
          void field.helpers.setValue(newValue ?? "");
        }}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}

function addValueIfNecessary(
  currentValue: number | null | undefined,
  options: number[],
): number[] {
  if (isNullish(currentValue)) {
    return options;
  }

  return options.includes(currentValue) ? options : [currentValue, ...options];
}

function getSchoolYearLabel(value: number | string | null): string {
  if (value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return formatSchoolYear(value);
}

function generateSchoolYears(currentYear: number, range: YearRange): number[] {
  const schoolYears: number[] = [];
  const startYear = currentYear - range.numberOfYearsInPast;
  const endYear = currentYear + range.numberOfYearsInFuture;
  for (let year = startYear; year <= endYear; year++) {
    schoolYears.push(year);
  }
  return schoolYears;
}
