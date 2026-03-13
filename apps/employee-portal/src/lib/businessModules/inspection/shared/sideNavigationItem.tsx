/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OtherHousesOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import { ApiInspectionFeature } from "@eshg/inspection-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";

import { routes } from "./routes";

const subItems: SideNavigationSubItem[] = [
  {
    name: "Vorgänge",
    href: routes.procedures.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
  {
    name: "Teamansicht",
    href: routes.teamview.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionLeader),
  },
  {
    name: "Checklistendefinitionen",
    href: routes.checklists.definitions.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionChecklistdefinitionsRead),
  },
  {
    name: "Datenaustausch",
    href: routes.repository.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionCentralrepositoryRead),
  },
  {
    name: "Objekttypen",
    href: routes.objectTypes.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionObjecttypesRead),
  },
  {
    name: "Entnahmestellen",
    href: routes.samplingPoints.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
  {
    name: "Textbausteine",
    href: routes.textBlocks.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
  {
    name: "Einrichtungen suchen",
    href: routes.facilities.webSearch.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
  {
    name: "Packlistendefinitionen",
    href: routes.packlists.definitions.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
  {
    name: "Posteingang",
    href: routes.inbox.index,
    accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  },
];

function SamplingPointSideNavigationItem() {
  const sampleFeatureEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.Samples,
  );

  const filteredSubItems = sampleFeatureEnabled
    ? subItems
    : subItems.filter((item) => item.name !== "Entnahmestellen");

  return (
    <NavigationItem
      item={{
        type: "SideNavigationParentItem",
        name: "Hygiene",
        decorator: <OtherHousesOutlined />,
        subItems: filteredSubItems,
      }}
    />
  );
}

const sideNavigationItem: SideNavigationSuspenseItem = {
  type: "SideNavigationSuspenseItem",
  name: "Hygiene",
  decorator: <OtherHousesOutlined />,
  accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
  component: SamplingPointSideNavigationItem,
};

export function resolveSideNavigationItems(): SideNavigationItem[] {
  return [sideNavigationItem];
}
