/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { EscalatorWarning } from "@mui/icons-material";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import {
  SideNavigationItem,
  SideNavigationSubItem,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Einschulung",
  decorator: <EscalatorWarning />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.overview,
    accessCheck: hasUserRole(ApiUserRole.SchoolEntryAdmin),
  },
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
  const subItems = isInboxEnabled
    ? [...defaultSubItems, inboxNavigationItem]
    : defaultSubItems;
  return [{ ...sideNavigationItem, subItems }];
}
