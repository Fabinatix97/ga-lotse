/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabProps, Tabs, TabsProps } from "@mui/joy";
import { Children, Dispatch, ReactNode, useState } from "react";
import { isFunction } from "remeda";

export function UnstyledTabs<T extends TabProps["value"] | null>({
  children,
  initialValue,
  ...props
}: Readonly<
  Omit<TabsProps, "children"> & {
    children:
      | ((props: {
          currentValue: T | null;
          setValue: Dispatch<T | null>;
          internalTabListFunction: () => void;
        }) => ReactNode)
      | ReactNode;
    initialValue: T | null;
  }
>) {
  const [previousTabValue, setPreviousTabValue] = useState<T | null>(null);

  const [tabValue, setTabValue] = useState<T | null>(initialValue ?? null);

  function internalTabListFunction() {
    setPreviousTabValue(tabValue);
    setTabValue(null);
  }

  return (
    <Tabs
      sx={{
        "--Tab-indicatorThickness": 0,
        "--Tabs-spacing": 0,
        backgroundColor: "inherit",
        height: "100%",
      }}
      value={tabValue}
      onChange={(_e, value) => {
        if (previousTabValue !== value) {
          setTabValue(value as T | null);
        }
      }}
      {...props}
    >
      {isFunction(children)
        ? children({
            currentValue: tabValue,
            setValue: setTabValue,
            internalTabListFunction,
          })
        : Children.only(children)}
    </Tabs>
  );
}
