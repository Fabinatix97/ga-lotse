/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import AddIcon from "@mui/icons-material/Add";
import { Button, ButtonProps } from "@mui/joy";

export function InfoTileAddButton(
  props: Omit<ButtonProps, "component" | "startDecorator">,
) {
  return (
    <Button
      variant="plain"
      sx={{ justifyContent: "start", width: "fit-content" }}
      startDecorator={<AddIcon />}
      {...props}
    />
  );
}
