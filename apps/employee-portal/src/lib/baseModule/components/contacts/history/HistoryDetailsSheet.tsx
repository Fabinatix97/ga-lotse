/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

export function HistoryDetailsSheet(props: RequiresChildren) {
  return (
    <Sheet
      sx={{
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 1,
        gap: 0.5,
      }}
    >
      {props.children}
    </Sheet>
  );
}
