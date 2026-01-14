/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckCircle, CheckCircleOutlineOutlined } from "@mui/icons-material";
import { Stack, Typography, styled } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";

const StatusFulfilled = styled(CheckCircle)(({ theme }) => ({
  fill: theme.colorSchemes.light.palette.success.outlinedColor,
}));

const StatusUnfulfilled = styled(CheckCircleOutlineOutlined)(({ theme }) => ({
  fill: theme.colorSchemes.light.palette.text.tertiary,
}));

interface StatusIndicatorProps {
  name: string;
  phase: number;
  progress: number;
}

export function StatusIndicator(props: StatusIndicatorProps) {
  const { name, phase, progress } = props;
  const fulfilled = progress >= phase;
  const StatusIcon = fulfilled ? StatusFulfilled : StatusUnfulfilled;
  const ariaLabel = `Status: '${name}' ist ${fulfilled ? "erfüllt" : "unerfüllt"}`;

  return (
    <Stack direction="row" gap={1} aria-label={ariaLabel}>
      <StatusIcon />
      <Typography aria-hidden="true">{name}</Typography>
      <Typography component="span" sx={visuallyHidden}>
        {ariaLabel}
      </Typography>
    </Stack>
  );
}
