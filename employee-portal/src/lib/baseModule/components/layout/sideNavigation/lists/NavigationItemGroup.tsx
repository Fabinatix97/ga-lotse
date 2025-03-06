/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@eshg/lib-employee-portal";
import { List, styled } from "@mui/joy";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";

export function NavigationItemGroup(props: {
  itemGroup: SideNavigationItem[];
}) {
  if (props.itemGroup.length === 0) {
    return undefined;
  }

  const list = props.itemGroup.map((item) => {
    return <NavigationItem key={item.name} item={item} />;
  });
  return <StyledList>{list}</StyledList>;
}

const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
  flex: 0,
  gap: theme.spacing(1),
  "--ListItem-radius": theme.radius.md,
  position: "static",
  // Small extra space that makes room for focus outline (keyboard navigation)
  paddingBlock: "0.25rem",
  "&:empty": {
    display: "none",
  },
}));
