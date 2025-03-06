/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { HivOutlined } from "@/lib/shared/components/icons/HivOutlined";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "HIV-STI",
  decorator: <HivOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
  },
  {
    name: "Wartezimmer",
    href: routes.waitingRoom.index,
    accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
  },
  {
    name: "Terminblöcke",
    href: routes.appointmentBlockGroups.index,
    accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
  },
  {
    name: "Terminarten",
    href: routes.appointmentDefinition,
    accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
  },
  {
    name: "Textvorlagen",
    href: routes.textTemplates,
    accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
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
