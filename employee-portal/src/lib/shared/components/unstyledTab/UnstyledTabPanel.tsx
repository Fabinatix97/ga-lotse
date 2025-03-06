/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabPanel, TabPanelProps } from "@mui/joy";
import { PropsWithChildren } from "react";

export function UnstyledTabPanel({
  children,
  ...props
}: Readonly<PropsWithChildren<TabPanelProps>>) {
  return (
    <TabPanel sx={{ flex: 0 }} {...props}>
      {children}
    </TabPanel>
  );
}
