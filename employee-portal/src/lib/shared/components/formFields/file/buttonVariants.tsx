/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { UploadFileOutlined } from "@mui/icons-material";
import { Button, ButtonProps, styled } from "@mui/joy";

export const StyledButton = styled(Button)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  fontWeight: theme.vars.fontWeight.md,
  background: theme.vars.palette.background.surface,
  padding: theme.spacing(0.75, 1),
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
  > {
  activeDragOver?: boolean;
  error: boolean;
}

export function FileInputButton(props: FileButtonProps) {
  const { error, activeDragOver, ...buttonProps } = props;

  return (
    <StyledButton
      {...buttonProps}
      variant="outlined"
      color={activeDragOver ? "primary" : error ? "danger" : "neutral"}
      endDecorator={<UploadFileOutlined />}
    />
  );
}

export function FileButton(props: FileButtonProps) {
  const { error, activeDragOver, ...buttonProps } = props;

  return (
    <StyledButton
      {...buttonProps}
      variant="outlined"
      color={activeDragOver ? "primary" : error ? "danger" : "primary"}
      startDecorator={<UploadFileOutlined />}
      sx={{ width: "fit-content" }}
    />
  );
}
