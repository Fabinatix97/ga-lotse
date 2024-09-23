/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { IconButton, IconButtonProps, Tooltip } from "@mui/joy";

interface FieldIconButtonProps extends IconButtonProps {
  title: string;
}

export function FieldIconButton(props: FieldIconButtonProps) {
  const { title, ...buttonProps } = props;

  return (
    <Tooltip title={title} size="sm">
      <IconButton variant="outlined" aria-label={title} {...buttonProps} />
    </Tooltip>
  );
}
