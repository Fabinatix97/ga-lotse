/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { BookmarkOutlined } from "@mui/icons-material";

import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Zahnärztl. Dienst",
  decorator: <BookmarkOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Prophylaxen",
    href: routes.prophylaxisSessions,
    accessCheck: hasUserRole(ApiUserRole.DentalAdmin),
  },
  {
    name: "Kinder",
    href: routes.children.overview,
    accessCheck: hasUserRole(ApiUserRole.DentalAdmin),
  },
];

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const subItems = defaultSubItems;
  return {
    isLoading: false,
    items: [{ ...sideNavigationItem, subItems }],
  };
}
