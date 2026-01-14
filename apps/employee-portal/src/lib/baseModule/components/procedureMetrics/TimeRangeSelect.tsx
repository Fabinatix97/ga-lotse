/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Option, Select, Stack } from "@mui/joy";

export function TimeRangeSelect(props: {
  optionsInMonths: number[];
  selectedTimeRange: number;
  setSelectedTimeRange: (value: number) => void;
}) {
  const options = props.optionsInMonths.map((month) =>
    month === 1
      ? {
          label: "Letzter Monat",
          value: 1,
        }
      : {
          label: `Letzte ${month} Monate`,
          value: month,
        },
  );

  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="flex-end">
      <Select
        size="sm"
        sx={{
          width: 200,
        }}
        color="primary"
        placeholder="Zeitraum auswählen"
        aria-label="Zeitraum"
        value={props.selectedTimeRange}
        onChange={(_, value) => {
          if (value) {
            props.setSelectedTimeRange(value);
          }
        }}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Stack>
  );
}
