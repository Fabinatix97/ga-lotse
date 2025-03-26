/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { SideNavigationItem, hasUserRole } from "@eshg/lib-employee-portal";
import { ErrorOutlineOutlined, SettingsOutlined } from "@mui/icons-material";

import { routes } from "./routes";

function getEndDecorator(status: "error" | "warning" | "correct") {
  switch (status) {
    case "error":
      return <ErrorOutlineOutlined color="danger" sx={{ fontSize: "1rem" }} />;
    case "warning":
      return <ErrorOutlineOutlined color="warning" sx={{ fontSize: "1rem" }} />;
    case "correct":
      return undefined;
  }
}

export const sideNavigationItems: SideNavigationItem[] = [
  {
    type: "SideNavigationParentItem",
    name: "GA-Konfigurator",
    decorator: <SettingsOutlined />,
    subItems: [
      {
        name: "Grundmodul",
        href: routes.baseModule.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
        endDecorator: getEndDecorator("error"),
      },
      {
        name: "Einschulung",
        href: routes.schoolEntry.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
        endDecorator: getEndDecorator("warning"),
      },
      {
        name: "Impfberatung",
        href: routes.travelMedicine.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
      },
      {
        name: "Masernschutz",
        href: routes.measlesProtection.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
      },
      {
        name: "Medizinalaufsicht",
        href: routes.medicalRegistry.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
      },
      {
        name: "HIV-STI",
        href: routes.stiProtection.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
      },
      {
        name: "Sexarbeit",
        href: routes.sexWork.index,
        accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
      },
    ],
  },
];
