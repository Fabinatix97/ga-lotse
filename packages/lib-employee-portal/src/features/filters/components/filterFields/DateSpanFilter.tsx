/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { format, parse, startOfDay, subDays } from "date-fns";
import { isEmpty } from "remeda";

import {
  DateSpanFilterDefinition,
  DateSpanFilterValue,
} from "@/features/filters/types/DateSpanFilter";

interface DateSpanFilterProps {
  definition: DateSpanFilterDefinition;
  value: DateSpanFilterValue | null;
  onChange: (value: DateSpanFilterValue | null) => void;
}

export function DateSpanFilter(props: DateSpanFilterProps) {
  function handleStartDateChange(optionValue: string) {
    props.onChange(
      !isEmpty(optionValue) || !isEmpty(props.value?.endDate)
        ? {
            type: "DateSpan",
            key: props.definition.key,
            startDate: isEmpty(optionValue) ? undefined : optionValue,
            endDate: props.value?.endDate,
          }
        : null,
    );
  }

  function handleEndDateChange(optionValue: string) {
    props.onChange(
      !isEmpty(optionValue) || !isEmpty(props.value?.startDate)
        ? {
            type: "DateSpan",
            key: props.definition.key,
            startDate: props.value?.startDate,
            endDate: isEmpty(optionValue) ? undefined : optionValue,
          }
        : null,
    );
  }

  function setToday() {
    const today = format(new Date(), "yyyy-MM-dd");
    props.onChange({
      type: "DateSpan",
      key: props.definition.key,
      startDate: today,
      endDate: today,
    });
  }

  return (
    <Stack gap={2} sx={{ width: "100%" }}>
      <FormControl>
        <FormLabel>Start</FormLabel>
        <Input
          type="date"
          value={props.value?.startDate ?? ""}
          onChange={(event) => handleStartDateChange(event.target.value)}
          slotProps={{
            input: { max: props.value?.endDate ?? maxInput(props.definition) },
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Ende</FormLabel>
        <Input
          type="date"
          value={props.value?.endDate ?? ""}
          onChange={(event) => handleEndDateChange(event.target.value)}
          slotProps={{
            input: {
              min: props.value?.startDate,
              max: maxInput(props.definition),
            },
          }}
        />
      </FormControl>
      {props.definition.showTodayButton && (
        <Button variant="soft" onClick={() => setToday()}>
          Nur heute
        </Button>
      )}
    </Stack>
  );
}

function maxInput(definition: DateSpanFilterDefinition) {
  return definition.maxInputPast
    ? format(subDays(new Date(), 1), "yyyy-MM-dd")
    : undefined;
}

export function validateDateSpan(
  { maxInputPast, doNotRequireStartAndEnd }: DateSpanFilterDefinition,
  { startDate, endDate }: DateSpanFilterValue,
) {
  if (startDate === undefined && endDate === undefined) {
    return undefined;
  }

  if (
    !doNotRequireStartAndEnd &&
    (startDate === undefined || endDate === undefined)
  ) {
    return "Die Zeitspanne wurde unvollständig angegeben.";
  }

  const parsedStartDate = startDate
    ? parse(startDate, "yyyy-MM-dd", new Date())
    : undefined;
  const parsedEndDate = endDate
    ? parse(endDate, "yyyy-MM-dd", new Date())
    : undefined;

  if (parsedEndDate && parsedStartDate && parsedEndDate < parsedStartDate) {
    return "Das Enddatum darf nicht vor dem Startdatum liegen.";
  }

  if (
    maxInputPast &&
    ((parsedStartDate && parsedStartDate >= startOfDay(new Date())) ||
      (parsedEndDate && parsedEndDate >= startOfDay(new Date())))
  ) {
    return "Die Zeitspanne muss in der Vergangenheit liegen.";
  }

  return undefined;
}
