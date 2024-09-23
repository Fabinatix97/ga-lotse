/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { Stack } from "@mui/joy";
import { ReactElement } from "react";

import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import {
  RadioGroupField,
  RadioGroupFieldProps,
} from "@/lib/shared/components/formFields/RadioGroupField";

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
      <Stack gap={2}>
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
