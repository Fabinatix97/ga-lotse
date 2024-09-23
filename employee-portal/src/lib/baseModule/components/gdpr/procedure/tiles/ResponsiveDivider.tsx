/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";

export function ResponsiveDivider() {
  return (
    <>
      <Divider
        orientation={"vertical"}
        sx={{ display: { xxs: "none", md: "unset" } }}
      />
      <Divider orientation={"horizontal"} sx={{ display: { md: "none" } }} />
    </>
  );
}
