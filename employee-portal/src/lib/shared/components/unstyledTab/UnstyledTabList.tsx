/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabList, TabListProps } from "@mui/joy";
import { PropsWithChildren } from "react";

export function UnstyledTabList({
  children,
  ...props
}: Readonly<PropsWithChildren<TabListProps>>) {
  return (
    <TabList
      sx={{
        "--ListItem-paddingY": 0,
        boxShadow: "inherit",
        paddingBottom: 0,
        gap: 2,
      }}
      {...props}
    >
      {children}
    </TabList>
  );
}
