/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FavoriteBorder } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "ProstSchG",
  decorator: <FavoriteBorder />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.ProstituteProtectionAdmin),
  },
];

export function resolveSideNavigationItems(): SideNavigationItem[] {
  const subItems = defaultSubItems;

  return [
    {
      type: "SideNavigationParentItem",
      ...sideNavigationItem,
      subItems,
    },
  ];
}
