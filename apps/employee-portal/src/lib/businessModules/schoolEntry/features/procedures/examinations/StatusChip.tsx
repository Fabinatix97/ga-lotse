/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps, Stack, Typography, styled } from "@mui/joy";
import { useId } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

interface StyledChipProps {
  minWidth?: ChipMinWidth;
}
type ChipMinWidth = "sm" | "md" | "lg";

const CHIP_MIN_WIDTH: Record<ChipMinWidth, string> = {
  sm: "2.5rem",
  md: "3.5rem",
  lg: "3.75rem",
};

const StyledChip = styled(Chip)<StyledChipProps>(({ size }) => ({
  minWidth: CHIP_MIN_WIDTH[size ?? "md"],
  height: "1.5rem",
  alignSelf: "center",
  textAlign: "center",
}));

type StatusChipProps = LabelProps & StyledChipProps & RequiresChildren;
type LabelProps = { label: string } | { "aria-label": string };

export function StatusChip(props: StatusChipProps) {
  const labelId = useId();

  const baseChipProps: ChipProps = {
    variant: "outlined",
    role: "status",
    "aria-live": "polite",
  };

  if ("aria-label" in props) {
    return (
      <StyledChip {...baseChipProps} aria-label={props["aria-label"]}>
        {props.children}
      </StyledChip>
    );
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography id={labelId} fontSize="sm">
        {props.label}
      </Typography>
      <StyledChip
        {...baseChipProps}
        minWidth={props.minWidth}
        aria-labelledby={labelId}
      >
        {props.children}
      </StyledChip>
    </Stack>
  );
}
