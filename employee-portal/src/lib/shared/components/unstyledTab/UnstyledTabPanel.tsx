/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabPanel, TabPanelProps, TabProps } from "@mui/joy";
import { PropsWithChildren } from "react";

export function UnstyledTabPanel<T extends TabProps["value"]>({
  children,
  ...props
}: Readonly<PropsWithChildren<Omit<TabPanelProps, "value"> & { value: T }>>) {
  return (
    <TabPanel
      aria-labelledby={`${props.value}-Tab`}
      sx={{ display: "contents" }}
      {...props}
    >
      {children}
    </TabPanel>
  );
}
