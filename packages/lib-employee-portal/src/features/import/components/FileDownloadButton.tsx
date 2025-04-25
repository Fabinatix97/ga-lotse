/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileDownloadOutlined } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

interface FileDownloadButtonProps
  extends Pick<ButtonProps, "color" | "variant">,
    RequiresChildren {
  file: File;
}

export function FileDownloadButton(props: FileDownloadButtonProps) {
  const { file, ...buttonProps } = props;
  const objectUrl = URL.createObjectURL(props.file);

  return (
    <Button
      {...buttonProps}
      component="a"
      href={objectUrl}
      download={file.name}
      endDecorator={<FileDownloadOutlined />}
    />
  );
}
