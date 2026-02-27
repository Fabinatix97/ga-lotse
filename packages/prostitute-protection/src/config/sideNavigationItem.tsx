/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TaskOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "ProstSchG",
  decorator: <TaskOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.ProstituteProtectionAdmin),
  },
  {
    name: "Wartezimmer",
    href: routes.waitingRoom,
    accessCheck: hasUserRole(ApiUserRole.ProstituteProtectionAdmin),
  },
  {
    name: "Personensuche",
    href: routes.searchPerson.index,
    accessCheck: hasUserRole(ApiUserRole.ProstituteProtectionAdmin),
  },
  {
    name: "Terminübersicht",
    href: routes.appointments.index,
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
