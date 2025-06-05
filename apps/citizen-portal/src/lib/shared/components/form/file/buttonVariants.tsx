/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { UploadOutlined } from "@mui/icons-material";
import { Button, ButtonProps, styled } from "@mui/joy";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 6),
}));

interface FileButtonProps
  extends Pick<
    ButtonProps,
    | "sx"
    | "aria-controls"
    | "onClick"
    | "children"
    | "onDrop"
    | "onDragOver"
    | "onDragLeave"
    | "onDragEnd"
    | "aria-describedby"
  > {
  activeDragOver?: boolean;
  error: boolean;
}

export function FileButton(props: FileButtonProps) {
  const { error, activeDragOver, ...buttonProps } = props;

  return (
    <StyledButton
      {...buttonProps}
      variant="outlined"
      color={activeDragOver ? "primary" : error ? "danger" : "primary"}
      startDecorator={<UploadOutlined />}
    />
  );
}

export const StyledRemoveButton = styled(Button)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.danger[400],
  },
  "&:active": { backgroundColor: "transparent" },
  padding: 0,
  border: "none",
  background: "none",
  color: theme.palette.danger[500],
  textDecoration: "underline",
}));
