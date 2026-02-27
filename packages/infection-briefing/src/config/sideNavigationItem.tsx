/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FoodBankOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Lebensmittelausweis",
  decorator: <FoodBankOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.InfectionBriefingAdmin),
  },
  {
    name: "Terminblöcke",
    href: routes.appointmentBlockGroups.index,
    accessCheck: hasUserRole(ApiUserRole.InfectionBriefingAdmin),
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
