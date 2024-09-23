/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { FieldProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Autocomplete, AutocompleteProps } from "@mui/joy";
import { isNullish } from "remeda";

import { formatSchoolYear } from "@/lib/businessModules/schoolEntry/features/procedures/formatters";

const SCHOOL_YEAR_OPTIONS = generateSchoolYears(new Date().getFullYear(), 10);

type SchoolYearAutocompleteProps = Omit<
  AutocompleteProps<number, false, false, false>,
  "options" | "getOptionLabel"
>;

export function SchoolYearAutocomplete(props: SchoolYearAutocompleteProps) {
  return (
    <Autocomplete
      {...props}
      options={addValueIfNecessary(props.value, SCHOOL_YEAR_OPTIONS)}
      getOptionLabel={getSchoolYearLabel}
    />
  );
}

export function SchoolYearField(props: FieldProps<OptionalFieldValue<number>>) {
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

function generateSchoolYears(
  currentYear: number,
  numberOfYearsInFutureOrPast: number,
): number[] {
  const schoolYears: number[] = [];
  const startYear = currentYear - numberOfYearsInFutureOrPast;
  const endYear = currentYear + numberOfYearsInFutureOrPast;
  for (let year = startYear; year <= endYear; year++) {
    schoolYears.push(year);
  }
  return schoolYears;
}
