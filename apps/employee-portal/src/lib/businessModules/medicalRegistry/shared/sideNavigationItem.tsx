/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MedicalServicesOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import { SideNavigationItem, hasUserRole } from "@eshg/lib-employee-portal";

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
