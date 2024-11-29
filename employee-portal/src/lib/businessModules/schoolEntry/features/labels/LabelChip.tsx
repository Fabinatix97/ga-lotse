/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { Chip, Tooltip } from "@mui/joy";
import { Typography, styled } from "@mui/joy";
import { useState } from "react";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

interface Props {
  label: Label;
}

function contrastColor(color: string) {
  // Source: https://stackoverflow.com/a/3943023/112731, which is
  // based on: https://www.w3.org/TR/WCAG20/#relativeluminancedef

  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b) > 0.179
    ? "#000000"
    : "#FFFFFF";
}

function c(color: number) {
  const c = color / 255.0;
  if (c <= 0.03928) {
    return c / 12.92;
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }
}

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "hexColor",
})<{ hexColor: string }>(({ hexColor }) => ({
  ".MuiChip-action": {
    backgroundColor: hexColor,
    color: contrastColor(hexColor),
    maxWidth: "100%",
  },
}));

export function LabelChip(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title={props.label.name} size="sm" placement="right">
        <StyledChip
          hexColor={props.label.hexColor}
          variant="solid"
          onClick={() => {
            setOpen(true);
          }}
        >
          {props.label.name}
        </StyledChip>
      </Tooltip>
      <OverlayBoundary>
        <BaseModal
          open={open}
          onClose={() => setOpen(false)}
          modalTitle="Kennung"
        >
          <Typography>{props.label.name}</Typography>
        </BaseModal>
      </OverlayBoundary>
    </>
  );
}
