/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Radio, RadioProps, Sheet, Stack, radioClasses } from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";

export function RadioSheet({
  value,
  label,
  endDecorator,
  radioProps,
}: PropsWithChildren<{
  value: unknown;
  label: string;
  radioProps?: RadioProps;
  endDecorator?: ReactNode;
}>) {
  return (
    <Sheet
      component="label"
      variant="outlined"
      sx={(theme) => ({
        padding: endDecorator ? "11px 16px 11px 16px" : "17px 16px 17px 16px",
        alignItems: "center",
        borderRadius: "md",
        borderColor: theme.palette.a11y.neutral,
        [`:has(.${radioClasses.checked})`]: {
          backgroundColor: theme.palette.background.level1,
        },
        [`&:hover`]: { backgroundColor: theme.palette.background.level1 },
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Radio overlay value={value} label={label} {...radioProps} />
        {endDecorator}
      </Stack>
    </Sheet>
  );
}
