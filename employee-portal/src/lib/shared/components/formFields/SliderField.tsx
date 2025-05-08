/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Slider } from "@mui/joy";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";

interface SliderFieldProps extends Omit<FieldProps<number>, "label"> {
  min: number;
  max: number;
  ariaLabel?: string;
}

export function SliderField(props: SliderFieldProps) {
  const field = useBaseField<number>(props);

  return (
    <Slider
      min={props.min}
      max={props.max}
      marks
      value={field.input.value}
      valueLabelDisplay="auto"
      size="lg"
      sx={{ zIndex: 2 }}
      aria-label={props.ariaLabel}
      onChange={(_, value) => field.helpers.setValue(value as number)}
    />
  );
}
