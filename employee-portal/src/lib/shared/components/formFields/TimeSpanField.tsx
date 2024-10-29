/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { FieldProps } from "@eshg/lib-portal/types/form";
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

import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/statistics/timeRangeHelper";

export interface TimeSpan {
  start: string;
  end: string;
}

export interface TimeSpanFieldProps
  extends Omit<FieldProps<TimeSpan>, "label"> {
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
        <Stack direction={"row"} gap={1}>
          <Typography
            component={"label"}
            level="body-md"
            sx={{ "--Typography-gap": "8px" }}
            startDecorator={
              <Switch
                variant="outlined"
                checked={checked}
                onChange={(event) => onCheckedChange(event.target.checked)}
                sx={{
                  "--Switch-trackWidth": "48px",
                  "--Switch-trackHeight": "24px",
                  "--Switch-thumbSize": "16px",
                }}
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
