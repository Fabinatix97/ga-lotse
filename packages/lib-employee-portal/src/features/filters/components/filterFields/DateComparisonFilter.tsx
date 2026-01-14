/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormLabel, Input, Select, Stack } from "@mui/joy";

import { EnumMap, SelectOptions, buildEnumOptions } from "@eshg/lib-portal";

import {
  DateComparisonFilterDefinition,
  DateComparisonFilterValue,
  DateComparisonOperator,
} from "../../types/DateComparisonFilter";

interface DateComparisonFilterProps {
  definition: DateComparisonFilterDefinition;
  value: DateComparisonFilterValue | null;
  onChange: (value: DateComparisonFilterValue | null) => void;
}

const dateComparisonOperators: EnumMap<DateComparisonOperator> = {
  EQUAL: "Gleich",
  GREATER_EQUAL: "Von einschließlich",
  LESS_EQUAL: "Bis einschließlich",
};

export function defaultDraftValueDateComparisonFilter(
  key: string,
): DateComparisonFilterValue {
  return {
    type: "DateComparison",
    key: key,
    value: "",
    operator: "EQUAL",
  };
}

export function DateComparisonFilter(props: DateComparisonFilterProps) {
  const draftValue =
    props.value ?? defaultDraftValueDateComparisonFilter(props.definition.key);

  function handleChange(optionValue: string | null) {
    props.onChange(
      optionValue
        ? {
            ...draftValue,
            value: optionValue,
          }
        : null,
    );
  }

  return (
    <Stack gap={2} width="100%">
      <Select
        aria-label="Intervalart"
        value={props.value?.operator ?? "EQUAL"}
        onChange={(_event, operator) =>
          props.onChange(
            operator
              ? {
                  ...draftValue,
                  operator: operator,
                }
              : null,
          )
        }
      >
        <SelectOptions options={buildEnumOptions(dateComparisonOperators)} />
      </Select>
      <FormControl>
        <FormLabel htmlFor="date-comparison-filter">Datum</FormLabel>
        <Input
          id="date-comparison-filter"
          type="date"
          value={props.value?.value ?? ""}
          sx={{ width: "100%" }}
          onChange={(event) => handleChange(event.target.value)}
        />
      </FormControl>
    </Stack>
  );
}
