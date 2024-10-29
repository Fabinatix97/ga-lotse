/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Radio, RadioProps, Sheet, radioClasses } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useField } from "formik";
import { PropsWithChildren } from "react";

/**
 * A card with border and a radio button on the left side to "select" it,
 * for usage in a `<RadioGroup>` with attribute `overlay={true}`.
 * See https://mui.com/joy-ui/react-radio-button/#overlay
 */
export function SelectableCard({
  value,
  children,
  sx,
  radioProps,
  allowDeselection = false,
  forGroupName,
}: PropsWithChildren<{
  value?: unknown;
  sx?: SxProps;
  radioProps?: RadioProps;
  allowDeselection?: boolean;
  forGroupName?: string;
}>) {
  const [field, _, helpers] = useField<string | null>(forGroupName!);

  function handleDeselect(forValue: unknown) {
    return function () {
      if (allowDeselection && field.value === forValue) {
        void helpers.setValue("");
      }
    };
  }

  return (
    <Sheet
      component="label"
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: "8px",
        [`:has(> .${radioClasses.checked})`]: {
          backgroundColor: "primary.100",
          borderColor: "primary.300",
        },
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.radio}`]: {
            "--variant-outlinedBorder": "primary.400",
            "--variant-borderWidth": "2px",
          },
        },
        ...sx,
      }}
    >
      <Radio
        value={value}
        overlay
        variant="outlined"
        color="primary"
        sx={{ flexShrink: 0 }}
        {...radioProps}
        onClick={handleDeselect(value)}
      />
      {children}
    </Sheet>
  );
}
