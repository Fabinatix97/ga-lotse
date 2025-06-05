/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ErrorOutlineOutlined, SettingsOutlined } from "@mui/icons-material";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  AccessCheck,
  SideNavigationItem,
  SideNavigationSuspenseItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { useGetAllModulesStatuses } from "@/lib/shared/api/queries/configurator/status";

import { resolveConfiguratorRoute } from "./routes";
import { ConfiguratorEndpointName, ConfiguratorModuleName } from "./types";

function getEndDecorator(status?: ConfiguratorStatus) {
  switch (status) {
    case "INCOMPLETE":
      return <ErrorOutlineOutlined color="warning" sx={{ fontSize: "1rem" }} />;
    case "PARTIALLY_COMPLETE":
      return <ErrorOutlineOutlined color="neutral" sx={{ fontSize: "1rem" }} />;
    case "UNAVAILABLE":
      return <ErrorOutlineOutlined color="danger" sx={{ fontSize: "1rem" }} />;
    default:
      return undefined;
  }
}

function subItem({
  name,
  module,
  endpointName = "index",
  data,
  accessCheck,
}: {
  name: string;
  module: ConfiguratorModuleName;
  endpointName?: ConfiguratorEndpointName | "index";
  data: ConfiguratorStatusOverview;
  accessCheck: AccessCheck;
}) {
  if (
    data[module] === undefined ||
    data[module].moduleState === "UNAVAILABLE"
  ) {
    return;
  }
  return {
    name,
    href: resolveConfiguratorRoute({
      module,
      endpointName,
    }),
    accessCheck,
    endDecorator: getEndDecorator(data[module].moduleState),
  };
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
          subItem({
            name: "Grundmodul",
            module: "BASE",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Einschulung",
            module: "SCHOOL_ENTRY",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Impfberatung",
            module: "TRAVEL_MEDICINE",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Masernschutz",
            module: "MEASLES_PROTECTION",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Open Data",
            module: "OPEN_DATA",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Medizinalaufsicht",
            module: "MEDICAL_REGISTRY",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "HIV-STI",
            module: "STI_PROTECTION",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Sexarbeit",
            module: "SEX_WORK",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
          subItem({
            name: "Amtsärztliche Dienste",
            module: "OFFICIAL_MEDICAL_SERVICE",
            endpointName: "index",
            accessCheck: sideNavigationItem.accessCheck,
            data,
          }),
        ].filter(isDefined),
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
