/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ErrorOutlineOutlined, SettingsOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSuspenseItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { useGetAllModulesStatuses } from "@/lib/shared/api/queries/configurator/status";

import { resolveConfiguratorRoute } from "./routes";

function getEndDecorator(status?: ConfiguratorStatus) {
  switch (status) {
    case "INCOMPLETE":
      return <ErrorOutlineOutlined color="warning" sx={{ fontSize: "1rem" }} />;
    case "PARTIALLY_COMPLETE":
      return <ErrorOutlineOutlined color="neutral" sx={{ fontSize: "1rem" }} />;
    default:
      return undefined;
  }
}

function ConfiguratorSideNavigationItem() {
  const { data } = useGetAllModulesStatuses();

  return (
    <NavigationItem
      item={{
        type: "SideNavigationParentItem",
        name: sideNavigationItem.name,
        decorator: sideNavigationItem.decorator,
        subItems: [
          {
            name: "Grundmodul",
            href: resolveConfiguratorRoute({
              module: "BASE",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.BASE?.moduleState),
          },
          {
            name: "Einschulung",
            href: resolveConfiguratorRoute({
              module: "SCHOOL_ENTRY",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.SCHOOL_ENTRY?.moduleState),
          },
          {
            name: "Impfberatung",
            href: resolveConfiguratorRoute({
              module: "TRAVEL_MEDICINE",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.TRAVEL_MEDICINE?.moduleState),
          },
          {
            name: "Masernschutz",
            href: resolveConfiguratorRoute({
              module: "MEASLES_PROTECTION",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(
              data?.MEASLES_PROTECTION?.moduleState,
            ),
          },
          {
            name: "Open Data",
            href: resolveConfiguratorRoute({
              module: "OPEN_DATA",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.OPEN_DATA?.moduleState),
          },
          {
            name: "Medizinalaufsicht",
            href: resolveConfiguratorRoute({
              module: "MEDICAL_REGISTRY",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.MEDICAL_REGISTRY?.moduleState),
          },
          {
            name: "HIV-STI",
            href: resolveConfiguratorRoute({
              module: "STI_PROTECTION",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.STI_PROTECTION?.moduleState),
          },
          {
            name: "Sexarbeit",
            href: resolveConfiguratorRoute({
              module: "SEX_WORK",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.SEX_WORK?.moduleState),
          },
          {
            name: "Amtsärztliche Dienste",
            href: resolveConfiguratorRoute({
              module: "OFFICIAL_MEDICAL_SERVICE",
              endpointName: "index",
            }),
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(
              data?.OFFICIAL_MEDICAL_SERVICE?.moduleState,
            ),
          },
        ],
      }}
    />
  );
}

const sideNavigationItem: SideNavigationSuspenseItem = {
  type: "SideNavigationSuspenseItem",
  name: "GA-Konfigurator",
  decorator: <SettingsOutlined />,
  accessCheck: hasUserRole(ApiUserRole.ConfigurationAccess),
  component: ConfiguratorSideNavigationItem,
};

export function resolveConfiguratorSideNavigationItems(): SideNavigationItem[] {
  return [sideNavigationItem];
}
