/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { HubOutlined } from "@mui/icons-material";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Masernschutz",
  decorator: <HubOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.MeaslesProtectionAdmin),
  },
  {
    name: "Terminblöcke",
    href: routes.appointmentBlockGroups.index,
    accessCheck: hasUserRole(ApiUserRole.MeaslesProtectionAdmin),
  },
];

const inboxNavigationItem: SideNavigationSubItem = {
  name: "Posteingang",
  href: routes.inbox.index,
  accessCheck: hasUserRole(ApiUserRole.MeaslesProtectionAdmin),
};

export function useSideNavigationItems(
  enabled: boolean,
): UseSideNavigationItemsResult {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);
  const subItems = isInboxEnabled
    ? [...defaultSubItems, inboxNavigationItem]
    : defaultSubItems;
  return {
    isLoading: false,
    items: enabled ? [{ ...sideNavigationItem, subItems }] : [],
  };
}
