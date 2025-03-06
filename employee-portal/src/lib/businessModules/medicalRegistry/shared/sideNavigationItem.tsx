/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { SideNavigationItem, hasUserRole } from "@eshg/lib-employee-portal";
import { MedicalServicesOutlined } from "@mui/icons-material";

import { routes } from "./routes";

export function resolveSideNavigationItems(): SideNavigationItem[] {
  return [
    {
      type: "SideNavigationLinkItem",
      name: "Medizinalaufsicht",
      decorator: <MedicalServicesOutlined />,
      href: routes.procedures.index,
      accessCheck: hasUserRole(ApiUserRole.MedicalRegistryAdmin),
    },
  ];
}
