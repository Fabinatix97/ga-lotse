/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tab, TabList, TabListProps, TabProps } from "@mui/joy";
import { ReactElement, cloneElement } from "react";

export function UnstyledTabList<T extends TabProps["value"]>({
  tabListItems,
  internalTabListFunction,
  ...props
}: Readonly<
  TabListProps & {
    tabListItems: { component: ReactElement; value: T }[];
    internalTabListFunction: () => void;
  }
>) {
  return (
    <TabList
      sx={{
        "--ListItem-paddingY": 0,
        boxShadow: "inherit",
        paddingBottom: 0,
        gap: 2,
      }}
      {...props}
      onClick={(event) => {
        internalTabListFunction();
        event.stopPropagation();
      }}
    >
      {tabListItems.map((tabListItem) => (
        <UnstyledTab<T>
          id={`${tabListItem.value}-Tab`}
          value={tabListItem.value}
          key={tabListItem.value}
        >
          {tabListItem.component}
        </UnstyledTab>
      ))}
    </TabList>
  );
}

function UnstyledTab<T extends TabProps["value"]>({
  children,
  ...props
}: Omit<TabProps, "value"> & { value: T } & { children: ReactElement }) {
  return <>{cloneElement(children, { component: Tab, ...props })}</>;
}
