/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Radio, RadioProps, Sheet, radioClasses } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
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
  changeBackgroundColor = true,
}: PropsWithChildren<{
  value?: unknown;
  sx?: SxProps;
  radioProps?: RadioProps;
  changeBackgroundColor?: boolean;
}>) {
  return (
    <Sheet
      component="label"
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: "8px",
        borderColor: "a11y.neutral",
        [`:has(> .${radioClasses.checked})`]: {
          backgroundColor: changeBackgroundColor ? "primary.100" : "",
          borderColor: "a11y.primary",
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
      />
      {children}
    </Sheet>
  );
}
