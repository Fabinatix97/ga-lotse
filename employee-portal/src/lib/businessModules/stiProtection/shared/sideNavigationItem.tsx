/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
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

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const isModuleEnabled = useIsNewFeatureEnabled(ApiBaseFeature.StiProtection);
  const subItems = defaultSubItems;
  return {
    isLoading: false,
    items: isModuleEnabled ? [{ ...sideNavigationItem, subItems }] : [],
  };
}
