/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edit } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/joy";

export function EditButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton
      aria-label="Bearbeiten"
      size="sm"
      variant="outlined"
      color="primary"
      {...props}
    >
      <Edit />
    </IconButton>
  );
}
