/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isEmpty } from "remeda";

export function LabelValueDisplay(props: {
  label: string;
  value: string;
  endDecorator?: ReactNode;
}) {
  return (
    <Stack gap={0.5} data-testid="labelValueDisplay">
      <Typography level="body-sm" fontWeight="500">
        {props.label}
      </Typography>
      <Typography
        level="body-sm"
        paddingX={1}
        paddingY={0.5}
        textColor="text.secondary"
        justifyContent="space-between"
        whiteSpace="pre-wrap"
        sx={(theme) => ({ backgroundColor: theme.palette.background.surface })}
        endDecorator={props.endDecorator}
      >
        {isEmpty(props.value) ? "-" : props.value}
      </Typography>
    </Stack>
  );
}
