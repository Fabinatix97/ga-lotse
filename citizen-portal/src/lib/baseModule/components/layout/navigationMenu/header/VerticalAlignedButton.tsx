/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, ButtonProps } from "@mui/joy";

export function VerticalAlignedButton(props: ButtonProps) {
  const { sx, children, ...buttonProps } = props;

  return (
    <Button
      variant="plain"
      sx={{
        color: (theme) => theme.palette.text.primary,
        flexDirection: "column",
        alignItems: "center",
        paddingBlock: 0,
        paddingInline: 1,
        ...sx,
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
