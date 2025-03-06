/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";
import { WcOutlined } from "@mui/icons-material";
import { useSuspenseQuery } from "@tanstack/react-query";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { useConfigApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";

import { routes } from "./routes";

const waitingRoomNavigationItem: SideNavigationSubItem = {
  name: "Wartezimmer",
  href: routes.waitingRoom,
  accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
};

const proceduresNavigationItem: SideNavigationSubItem = {
  name: "Vorgänge",
  href: routes.procedures.overview,
  accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Terminblöcke",
    href: routes.appointmentBlockGroups.overview,
    accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
  },
  {
    name: "Kennungen",
    href: routes.labels.overview,
    accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
  },
];

const inboxNavigationItem: SideNavigationSubItem = {
  name: "Posteingang",
  href: routes.inbox.overview,
  accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
};

const sideNavigationItem: SideNavigationSuspenseItem = {
  type: "SideNavigationSuspenseItem",
  name: "Einschulung",
  decorator: <WcOutlined />,
  accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
  component: SchoolEntrySideNavigationItem,
};

export function resolveSideNavigationItems(): SideNavigationItem[] {
  return [sideNavigationItem];
}

function SchoolEntrySideNavigationItem({
  isInboxEnabled,
}: SideNavigationItemsProps) {
  const configApi = useConfigApi();
  const { data: locationSelectionMode } = useSuspenseQuery(
    getLocationSelectionModeQuery(configApi),
  );

  const hasLocationMode =
    locationSelectionMode !== ApiLocationSelectionMode.None;

  const subItems = [
    proceduresNavigationItem,
    ...(hasLocationMode ? [] : [waitingRoomNavigationItem]),
    ...defaultSubItems,
    ...(isInboxEnabled ? [inboxNavigationItem] : []),
  ];

  return (
    <NavigationItem
      item={{
        type: "SideNavigationParentItem",
        name: sideNavigationItem.name,
        decorator: sideNavigationItem.decorator,
        subItems,
      }}
    />
  );
}
