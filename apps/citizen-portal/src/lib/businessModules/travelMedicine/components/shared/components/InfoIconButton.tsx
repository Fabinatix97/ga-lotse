/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { IconButton as JoyIconButton } from "@mui/joy";
import { PropsWithChildren } from "react";

export function InfoIconButton(
  props: PropsWithChildren<{
    disabled: boolean;
    label: string;
    onClick: () => void;
  }>,
) {
  return (
    <JoyIconButton
      aria-label={props.label}
      disabled={props.disabled}
      color="primary"
      size="sm"
      onClick={props.onClick}
    >
      <InfoOutlined sx={{ width: "24px", height: "24px" }} />
    </JoyIconButton>
  );
}
