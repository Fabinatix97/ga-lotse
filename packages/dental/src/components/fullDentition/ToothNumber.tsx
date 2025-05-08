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
  marginBottom: theme.spacing(2),
  //marginLeft and -Right needs to be set for firefox
  marginRight: "auto",
  marginLeft: "auto",
})) as typeof Typography;

interface ToothNumberProps {
  toothNumber: ApiTooth;
}

export function ToothNumber(props: ToothNumberProps) {
  return (
    <ToothNumberTypography component="legend">
      {getToothNumber(props.toothNumber)}
    </ToothNumberTypography>
  );
}

function getToothNumber(toothNumber: ApiTooth): number {
  return Number.parseInt(toothNumber.substring(1));
}
