/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider } from "@mui/joy";

export function ResponsiveDivider(props: { breakpoint?: "md" | "lg" }) {
  const breakpoint = props.breakpoint ?? "md";
  return (
    <Divider
      sx={{
        inlineSize: {
          xxs: "initial",
          [breakpoint]: "var(--Divider-thickness)",
        },
        blockSize: {
          xxs: "var(--Divider-thickness)",
          [breakpoint]: "initial",
        },
      }}
    />
  );
}
