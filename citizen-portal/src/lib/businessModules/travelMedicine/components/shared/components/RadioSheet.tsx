/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Radio, RadioProps, Sheet, Stack, radioClasses } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { PropsWithChildren, ReactNode } from "react";

export function RadioSheet({
  value,
  label,
  endDecorator,
  sx,
  radioProps,
}: PropsWithChildren<{
  value: unknown;
  label: string;
  sx?: SxProps;
  radioProps?: RadioProps;
  endDecorator?: ReactNode;
}>) {
  return (
    <Sheet
      component="label"
      variant="outlined"
      sx={{
        padding: endDecorator ? "11px 16px 11px 16px" : "17px 16px 17px 16px",
        alignItems: "center",
        borderRadius: "md",
        [`:has(> .${radioClasses.checked})`]: {
          backgroundColor: "primary.100",
          borderColor: "primary.300",
        },
        [`&:hover`]: { backgroundColor: "var(--background-level1, #F0F4F8)" },
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Radio value={value} label={label} {...radioProps} />
        {endDecorator}
      </Stack>
    </Sheet>
  );
}
