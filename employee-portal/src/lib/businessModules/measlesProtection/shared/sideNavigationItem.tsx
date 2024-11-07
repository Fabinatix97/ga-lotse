/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { Coronavirus } from "@mui/icons-material";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Masernschutz",
  decorator: <Coronavirus />,
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

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);
  const subItems = isInboxEnabled
    ? [...defaultSubItems, inboxNavigationItem]
    : defaultSubItems;
  return { isLoading: false, items: [{ ...sideNavigationItem, subItems }] };
}
