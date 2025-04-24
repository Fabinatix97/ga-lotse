/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FieldSetControl } from "@eshg/lib-portal/components/formFields/FieldSetControl";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";

import {
  RadioButtonsField,
  RadioButtonsFieldProps,
} from "@/lib/shared/components/formFields/RadioButtonsField";

export interface RadioButtonsWithFollowUpProps<
  T extends SelectOption = SelectOption,
> extends Omit<RadioButtonsFieldProps, "label" | "additionalField">,
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
