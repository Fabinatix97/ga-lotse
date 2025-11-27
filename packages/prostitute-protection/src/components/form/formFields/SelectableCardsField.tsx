/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactElement } from "react";

import { SelectableCard } from "@eshg/lib-employee-portal";
import {
  RadioGroupField,
  RadioGroupFieldProps,
  useBaseField,
} from "@eshg/lib-portal";

interface SelectableCardsFieldProps extends RadioGroupFieldProps {
  options: {
    value: string;
    content: ReactElement;
  }[];
}

export function SelectableCardsField(props: SelectableCardsFieldProps) {
  const { error } = useBaseField<string>(props);
  return (
    <RadioGroupField {...props}>
      <Stack
        gap={2}
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {props.options.map((it) => (
          <SelectableCard
            key={it.value}
            value={it.value}
            radioProps={{
              color: error ? "danger" : undefined,
            }}
            sx={{
              borderColor: error ? "danger.300" : undefined,
            }}
          >
            {it.content}
          </SelectableCard>
        ))}
      </Stack>
    </RadioGroupField>
  );
}
