/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { HivOutlined } from "@/lib/shared/components/icons/HivOutlined";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "HIV-STI",
  decorator: <HivOutlined />,
  accessCheck: hasUserRole(ApiUserRole.StiProtectionUser),
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
];

export function useSideNavigationItems(
  enabled: boolean,
): UseSideNavigationItemsResult {
  const subItems = defaultSubItems;
  return {
    isLoading: false,
    items: enabled ? [{ ...sideNavigationItem, subItems }] : [],
  };
}
