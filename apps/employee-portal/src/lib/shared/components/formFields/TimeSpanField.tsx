/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormControl,
  FormLabel,
  Option,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { useState } from "react";

import { DateField, FieldProps, useBaseField } from "@eshg/lib-portal";

import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/evaluations/timeRangeHelper";

export interface TimeSpan {
  start: string;
  end: string;
}

export function isEqualTimeSpan(timeSpan1: TimeSpan, timeSpan2: TimeSpan) {
  return timeSpan1.start === timeSpan2.start && timeSpan1.end === timeSpan2.end;
}

interface TimeSpanFieldProps extends Omit<FieldProps<TimeSpan>, "label"> {
  initialExplicitStartAndEndChecked?: boolean;
  label?: string;
}

export function TimeSpanField(props: TimeSpanFieldProps) {
  const field = useBaseField<TimeSpan>(props);
  const [numberOfMonths, setNumberOfMonths] = useState<number>(3);
  const [checked, setChecked] = useState<boolean>(
    !!props.initialExplicitStartAndEndChecked,
  );

  async function setTimeRange(numberOfMonths: number) {
    setNumberOfMonths(numberOfMonths);
    await field.helpers.setValue(getLastXMonthsTimeRange(numberOfMonths));
  }

  async function onCheckedChange(checked: boolean) {
    setChecked(checked);
    await setTimeRange(numberOfMonths);
  }

  return (
    <Stack gap={3} data-testid="timeSpanField">
      <FormControl disabled={checked}>
        <FormLabel>{props.label ?? "Zeitraum"}</FormLabel>
        <Select
          aria-label={props.label ?? "Zeitraum"}
          value={numberOfMonths}
          onChange={async (event, newValue) => setTimeRange(newValue!)}
        >
          <Option value={1}>Letzter Monat</Option>
          <Option value={3}>Letzte 3 Monate</Option>
          <Option value={6}>Letzte 6 Monate</Option>
          <Option value={12}>Letzte 12 Monate</Option>
        </Select>
      </FormControl>
      <Stack gap={2}>
        <Stack direction="row" gap={1}>
          <Typography
            component="label"
            level="body-md"
            sx={{ "--Typography-gap": "8px" }}
            startDecorator={
              <Switch
                variant="outlined"
                checked={checked}
                sx={{
                  "--Switch-trackWidth": "48px",
                  "--Switch-trackHeight": "24px",
                  "--Switch-thumbSize": "16px",
                }}
                onChange={(event) => onCheckedChange(event.target.checked)}
              />
            }
          >
            Start- und Enddatum angeben
          </Typography>
        </Stack>
        {checked && (
          <Stack gap={2}>
            <DateField
              name={`${props.name}.start`}
              label="Startdatum"
              required="Bitte Startdatum angeben"
            />
            <DateField
              name={`${props.name}.end`}
              label="Enddatum"
              required="Bitte Enddatum angeben"
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
