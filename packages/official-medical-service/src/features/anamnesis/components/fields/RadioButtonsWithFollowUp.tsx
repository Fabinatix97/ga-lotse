/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";

import {
  FieldSetControl,
  RadioButtonsField,
  RadioButtonsFieldProps,
  RequiresChildren,
  SelectOption,
} from "@eshg/lib-portal";

interface RadioButtonsWithFollowUpProps<T extends SelectOption = SelectOption>
  extends Omit<RadioButtonsFieldProps, "label" | "additionalField">,
    RequiresChildren {
  label: string;
  followUpOn: T["value"];
  inlineFollowUp?: boolean;
}

export function RadioButtonsWithFollowUp<T extends SelectOption>(
  props: RadioButtonsWithFollowUpProps<T>,
) {
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta<T["value"]>(props.name);

  return <MemoizedRadioButtonsWithFollowUp value={value} {...props} />;
}

interface InnerRadioButtonsWithFollowUpProps<T extends SelectOption>
  extends RadioButtonsWithFollowUpProps<T> {
  value: T["value"];
}

const MemoizedRadioButtonsWithFollowUp = memo(InnerRadioButtonsWithFollowUp);

function InnerRadioButtonsWithFollowUp<T extends SelectOption>({
  value,
  children,
  sx,
  inlineFollowUp,
  followUpOn,
  orientation,
  options,
  ...radioProps
}: InnerRadioButtonsWithFollowUpProps<T>) {
  const show = value === followUpOn;
  const showBelow = show && !inlineFollowUp;
  const showInline = show && inlineFollowUp;

  return (
    <FieldSetControl
      sx={{
        border: "none",
        padding: 0,
        ...sx,
      }}
      aria-label={radioProps.label}
      aria-live="polite"
    >
      <RadioButtonsField
        options={options}
        orientation={orientation}
        {...radioProps}
        additionalField={showInline ? children : undefined}
      />
      {showBelow ? (
        <Stack direction="column" gap={3}>
          {children}
        </Stack>
      ) : undefined}
    </FieldSetControl>
  );
}
