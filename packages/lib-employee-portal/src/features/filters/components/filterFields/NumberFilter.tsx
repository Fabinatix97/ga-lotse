/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
} from "@mui/joy";
import { ChangeEvent } from "react";
import { isDefined } from "remeda";

import {
  NumberFilterDefinition,
  NumberFilterDraftComparisonMode,
  NumberFilterDraftValue,
  NumberFilterNullInclusion,
  NumberFilterNumericComparison,
  defaultNumberFilterDraftValue,
} from "@/features/filters/types/NumberFilter";

const nullInclusionOptions: EnumMap<NumberFilterNullInclusion> = {
  EXCLUDE_NULL: "Ohne leere Felder",
  INCLUDE_NULL: "Mit leeren Feldern",
  ONLY_NULL: "Nur leere Felder",
};

const modeOptions: EnumMap<NumberFilterDraftComparisonMode> = {
  VALUE: "Wert",
  RANGE: "Bereich",
};

const numericComparisonOptions: EnumMap<NumberFilterNumericComparison> = {
  EQUAL: "Gleich",
  GREATER_THAN: "Größer",
  LESS_THAN: "Kleiner",
  GREATER_EQUAL: "Größer / Gleich",
  LESS_EQUAL: "Kleiner / Gleich",
};

interface NumberFilterProps {
  definition: NumberFilterDefinition;
  value: NumberFilterDraftValue | null;
  onChange: (value: NumberFilterDraftValue | null) => void;
}

export function NumberFilter(props: NumberFilterProps) {
  const draftValue =
    props.value ?? defaultNumberFilterDraftValue(props.definition.key);

  return (
    <Stack gap={1} width="100%">
      {draftValue.nullInclusion !== NumberFilterNullInclusion.OnlyNull && (
        <FormControl>
          <RadioGroup
            value={draftValue.mode}
            onChange={(event) =>
              props.onChange({
                ...draftValue,
                mode: event.target.value as NumberFilterDraftComparisonMode,
              })
            }
            sx={{ gap: 2 }}
          >
            <Radio
              value={NumberFilterDraftComparisonMode.Value}
              label={modeOptions[NumberFilterDraftComparisonMode.Value]}
              size="md"
            />
            {draftValue.mode === NumberFilterDraftComparisonMode.Value && (
              <NumberValue value={draftValue} onChange={props.onChange} />
            )}
            <Radio
              value={NumberFilterDraftComparisonMode.Range}
              label={modeOptions[NumberFilterDraftComparisonMode.Range]}
              size="md"
              sx={{ paddingTop: 0 }}
            />
            {draftValue.mode === NumberFilterDraftComparisonMode.Range && (
              <NumberRange
                definition={props.definition}
                value={draftValue}
                onChange={props.onChange}
              />
            )}
          </RadioGroup>
        </FormControl>
      )}
      <Select
        aria-label="Umgangsoptionen mit leeren Werten"
        value={draftValue.nullInclusion}
        onChange={(_event, value) =>
          props.onChange({ ...draftValue, nullInclusion: value! })
        }
      >
        <SelectOptions options={buildEnumOptions(nullInclusionOptions)} />
      </Select>
    </Stack>
  );
}

interface NumberValueProps {
  value: NumberFilterDraftValue;
  onChange: (value: NumberFilterDraftValue | null) => void;
}

function NumberValue(props: NumberValueProps) {
  return (
    <Stack gap={1} marginTop={-1} paddingLeft={4}>
      <Select
        aria-label="Vergleichsoperation"
        value={props.value.numericComparison}
        onChange={(_event, selectedValue) => {
          props.onChange({ ...props.value, numericComparison: selectedValue! });
        }}
      >
        <SelectOptions options={buildEnumOptions(numericComparisonOptions)} />
      </Select>
      <Input
        type="number"
        value={props.value.value}
        onChange={(event) => {
          props.onChange({ ...props.value, value: getNumberValue(event) });
        }}
      />
    </Stack>
  );
}

interface NumberRangeProps {
  definition: NumberFilterDefinition;
  value: NumberFilterDraftValue;
  onChange: (value: NumberFilterDraftValue | null) => void;
}

function NumberRange(props: NumberRangeProps) {
  return (
    <Stack paddingLeft={4}>
      {isDefined(props.definition.minValue) &&
        isDefined(props.definition.maxValue) &&
        props.definition.minValue !== props.definition.maxValue && (
          <Slider
            sx={{ alignSelf: "flex-end" }}
            aria-label="Nummer Bereich"
            value={[
              props.value.minValueInclusive === ""
                ? props.definition.minValue
                : props.value.minValueInclusive,
              props.value.maxValueInclusive === ""
                ? props.definition.maxValue
                : props.value.maxValueInclusive,
            ]}
            min={props.definition.minValue}
            max={props.definition.maxValue}
            onChange={(_event, value) => {
              if (Array.isArray(value)) {
                props.onChange({
                  ...props.value,
                  minValueInclusive: value[0]!,
                  maxValueInclusive: value[1]!,
                });
              }
            }}
            marks
            valueLabelDisplay="auto"
          />
        )}
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
        <Stack flex={1} minWidth={100}>
          <FormLabel>Von</FormLabel>
          <Input
            type="number"
            value={props.value.minValueInclusive}
            onChange={(event) => {
              props.onChange({
                ...props.value,
                minValueInclusive: getNumberValue(event),
              });
            }}
          />
        </Stack>
        <Stack flex={1} minWidth={100}>
          <FormLabel>Bis</FormLabel>
          <Input
            type="number"
            value={props.value.maxValueInclusive}
            onChange={(event) => {
              props.onChange({
                ...props.value,
                maxValueInclusive: getNumberValue(event),
              });
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

function getNumberValue(event: ChangeEvent<HTMLInputElement>) {
  const rawValue = event.target.valueAsNumber;
  return Number.isNaN(rawValue) ? "" : rawValue;
}
