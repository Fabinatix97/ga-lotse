/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ErrorIcon from "@mui/icons-material/Error";

export function NavigationItemError() {
  return (
    <ErrorIcon
      color="danger"
      size="xs"
      sx={{
        position: "absolute",
        zIndex: 1,
        left: -1,
        top: "1.2rem",
      }}
    />
  );
}
