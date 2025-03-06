/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tabs, TabsProps } from "@mui/joy";
import { PropsWithChildren } from "react";

export function UnstyledTabs({
  children,
  ...props
}: Readonly<PropsWithChildren<TabsProps>>) {
  return (
    <Tabs
      sx={{
        "--Tab-indicatorThickness": 0,
        "--Tabs-spacing": 0,
        backgroundColor: "inherit",
        height: "100%",
      }}
      {...props}
    >
      {children}
    </Tabs>
  );
}
