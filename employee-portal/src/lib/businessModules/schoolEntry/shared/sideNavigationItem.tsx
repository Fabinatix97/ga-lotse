/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";
import { WcOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
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

export function useSideNavigationItems(
  enabled: boolean,
): UseSideNavigationItemsResult {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  const configApi = useConfigApi();
  const {
    data: locationSelectionMode,
    isError: isLocationModeError,
    isLoading: isLocationModeLoading,
  } = useQuery({
    ...getLocationSelectionModeQuery(configApi),
    throwOnError: false,
    enabled,
  });

  if (!enabled) {
    return { isLoading: false, items: [] };
  }

  const hasLocationMode =
    locationSelectionMode !== ApiLocationSelectionMode.None;

  const subItems = [
    proceduresNavigationItem,
    ...(hasLocationMode ? [] : [waitingRoomNavigationItem]),
    ...defaultSubItems,
    ...(isInboxEnabled ? [inboxNavigationItem] : []),
  ];

  const sideNavigationItem = {
    name: "Einschulung",
    decorator: <WcOutlined />,
    error: isLocationModeError
      ? "Bei der Verbindung zum Einschulungsmodul ist ein Fehler aufgetreten."
      : undefined,
  };

  return {
    isLoading: isLocationModeLoading,
    items: [{ ...sideNavigationItem, subItems }],
  };
}
