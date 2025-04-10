/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectableCard } from "@eshg/lib-employee-portal";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  RadioGroupField,
  RadioGroupFieldProps,
} from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { Stack } from "@mui/joy";
import { ReactElement } from "react";

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
            forGroupName={props.name}
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
