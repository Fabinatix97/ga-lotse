/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { MedicalServicesOutlined } from "@mui/icons-material";

import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Medizinalaufsicht",
  decorator: <MedicalServicesOutlined />,
};

const defaultSubItems: SideNavigationSubItem[] = [
  {
    name: "Berufskartei",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.MedicalRegistryAdmin),
  },
];

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const subItems = defaultSubItems;
  return {
    isLoading: false,
    items: [{ ...sideNavigationItem, subItems }],
  };
}
