/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationSubItem,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { HubOutlined } from "@mui/icons-material";

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

export function resolveSideNavigationItems({
  isInboxEnabled,
}: SideNavigationItemsProps): SideNavigationItem[] {
  const subItems = isInboxEnabled
    ? [...defaultSubItems, inboxNavigationItem]
    : defaultSubItems;
  return [
    {
      type: "SideNavigationParentItem",
      ...sideNavigationItem,
      subItems,
    },
  ];
}
