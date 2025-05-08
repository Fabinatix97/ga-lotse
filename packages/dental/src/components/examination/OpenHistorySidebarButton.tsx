/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, ButtonProps } from "@mui/joy";

export function OpenHistorySidebarButton(props: Omit<ButtonProps, "children">) {
  return (
    <Button {...props} color="primary" variant="plain">
      Historie
    </Button>
  );
}
