/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UploadFileOutlined } from "@mui/icons-material";
import { Button, ButtonProps, styled } from "@mui/joy";

const StyledButton = styled(Button)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  fontWeight: theme.vars.fontWeight.md,
  background: theme.vars.palette.background.surface,
  padding: theme.spacing(0.75, 1),
}));

interface FileInputButtonProps
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

export function FileInputButton(props: Readonly<FileInputButtonProps>) {
  const { error, activeDragOver, ...buttonProps } = props;

  function getColor() {
    return error ? "danger" : "neutral";
  }

  return (
    <StyledButton
      {...buttonProps}
      variant="outlined"
      color={activeDragOver ? "primary" : getColor()}
      endDecorator={<UploadFileOutlined />}
    />
  );
}
