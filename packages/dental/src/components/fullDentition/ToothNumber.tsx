/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, styled } from "@mui/joy";

import { ApiTooth } from "@eshg/dental-api";

const ToothNumberTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.fontSize.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.palette.neutral[400],
  fontWeight: theme.fontWeight.lg,
  width: 36,
  height: 24,
  textAlign: "center",
})) as typeof Typography;

interface ToothNumberProps {
  id: string;
  toothNumber: ApiTooth;
}

export function ToothNumber(props: ToothNumberProps) {
  return (
    <ToothNumberTypography id={props.id}>
      {getToothNumber(props.toothNumber)}
    </ToothNumberTypography>
  );
}

function getToothNumber(toothNumber: ApiTooth): number {
  return Number.parseInt(toothNumber.substring(1));
}
