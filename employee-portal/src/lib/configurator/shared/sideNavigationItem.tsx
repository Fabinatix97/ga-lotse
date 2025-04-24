/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSuspenseItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";
import { ErrorOutlineOutlined, SettingsOutlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { useGetAllModulesStatuses } from "@/lib/configurator/api/queries/useGetAllModulesStatuses";

import { routes } from "./routes";

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
            href: routes.baseModule.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.baseModule?.moduleState),
          },
          {
            name: "Einschulung",
            href: routes.schoolEntry.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.schoolEntry?.moduleState),
          },
          {
            name: "Impfberatung",
            href: routes.travelMedicine.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.travelMedicine?.moduleState),
          },
          {
            name: "Masernschutz",
            href: routes.measlesProtection.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.measlesProtection?.moduleState),
          },
          {
            name: "Open Data",
            href: routes.opendata.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.opendata?.moduleState),
          },
          {
            name: "Medizinalaufsicht",
            href: routes.medicalRegistry.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.medicalRegistry?.moduleState),
          },
          {
            name: "HIV-STI",
            href: routes.stiProtection.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.stiProtection?.moduleState),
          },
          {
            name: "Sexarbeit",
            href: routes.sexWork.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(data?.sexWork?.moduleState),
          },
          {
            name: "Amtsärztliche Dienste",
            href: routes.officialMedicalService.index,
            accessCheck: sideNavigationItem.accessCheck,
            endDecorator: getEndDecorator(
              data?.officialMedicalService?.moduleState,
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
