/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { EmojiTransportation } from "@mui/icons-material";

import { useIsNewFeatureEnabled as useIsNewBaseFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import {
  SideNavigationSubItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

const sideNavigationItem = {
  name: "Begehung",
  decorator: <EmojiTransportation />,
};

const defaultSubItems: SideNavigationSubItem[] = [
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
];

const inboxNavigationItem: SideNavigationSubItem = {
  name: "Posteingang",
  href: routes.inbox.index,
  accessCheck: hasUserRole(ApiUserRole.InspectionProcedureEdit),
};

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const isInboxEnabled = useIsNewBaseFeatureEnabled(ApiBaseFeature.Inbox);
  const isInspectionInboxEnabled = useIsNewBaseFeatureEnabled(
    ApiBaseFeature.InspectionInbox,
  );

  const subItems =
    isInboxEnabled || isInspectionInboxEnabled
      ? [...defaultSubItems, inboxNavigationItem]
      : defaultSubItems;

  return {
    isLoading: false,
    items: [
      {
        ...sideNavigationItem,
        subItems,
      },
    ],
  };
}
