/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiLocationSelectionMode } from "@eshg/employee-portal-api/schoolEntry";
import { EscalatorWarning } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import {
  SideNavigationItem,
  SideNavigationSubItem,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useConfigApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

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

export function useSideNavigationItems(): SideNavigationItem[] {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  const configApi = useConfigApi();
  const { data: locationSelectionMode, isError: isLocationModeError } =
    useQuery({
      ...getLocationSelectionModeQuery(configApi),
      throwOnError: false,
    });

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
    decorator: <EscalatorWarning />,
    error: isLocationModeError
      ? "Bei der Verbindung zum Einschulungsmodul ist ein Fehler aufgetreten."
      : undefined,
  };

  return [{ ...sideNavigationItem, subItems }];
}
