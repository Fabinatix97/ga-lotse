/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CalendarTodayOutlined,
  ContactsOutlined,
  ContentPasteSearch,
  ContentPasteSearchOutlined,
  DashboardOutlined,
  GppGoodOutlined,
  InventoryOutlined,
  MailOutline,
  PeopleAltOutlined,
  PermMediaOutlined,
  TrackChangesOutlined,
  WarehouseOutlined,
} from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  gdprRoutes,
  hasUserRole,
  noCheck,
} from "@eshg/lib-employee-portal";
import { ApiOpenDataFeature } from "@eshg/opendata-api";

import { useIsNewFeatureEnabled as useIsNewOpenDataFeatureEnabled } from "@/lib/opendata/queries/feature";

import { routes } from "./shared/routes";

export const dashboardItem: SideNavigationItem = {
  type: "SideNavigationLinkItem",
  name: "Dashboard",
  href: routes.index,
  decorator: <DashboardOutlined />,
  accessCheck: noCheck(),
};

/**
 * These are the side navigation items of base module pages.
 * Navigation items of business module pages are defined in their respective files and must not be added here.
 */
const sideNavigationItems: SideNavigationItem[] = [
  {
    type: "SideNavigationLinkItem",
    name: "DSGVO",
    href: gdprRoutes.index,
    decorator: <GppGoodOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseGdprProcedureRead),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Benutzer",
    href: routes.users.index,
    decorator: <PeopleAltOutlined />,
    accessCheck: noCheck(),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Kalender",
    href: routes.calendar,
    decorator: <CalendarTodayOutlined />,
    accessCheck: noCheck(),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Ressourcen",
    href: routes.resources.index,
    decorator: <WarehouseOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseResourcesRead),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Inventar",
    href: routes.inventory.index,
    decorator: <InventoryOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseInventoryRead),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Kontakte",
    href: routes.contacts.index,
    decorator: <ContactsOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseContactsRead),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Kennzahlen",
    href: routes.metrics.index,
    decorator: <TrackChangesOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseProcedureMetricsRead),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Auditlog",
    href: routes.auditlog.index,
    decorator: <ContentPasteSearchOutlined />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogDecryptAndAccess),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Auditlog Freigabe",
    href: routes.auditlog.authorize,
    decorator: <ContentPasteSearch />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogAuthorizeAccess),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Open Data",
    href: routes.opendata.index,
    decorator: <PermMediaOutlined />,
    accessCheck: hasUserRole(ApiUserRole.OpenDataAdmin),
  },
  {
    type: "SideNavigationLinkItem",
    name: "Posteingang",
    href: routes.inbox,
    decorator: <MailOutline />,
    accessCheck: hasUserRole(ApiUserRole.InboxProcedureWrite),
  },
];

export function useSideNavigationItems(): SideNavigationItem[] {
  const isOpenDataEnabled = useIsNewOpenDataFeatureEnabled(
    ApiOpenDataFeature.OpenData,
  );

  let items = sideNavigationItems;
  if (!isOpenDataEnabled) {
    items = items.filter((item) => item.name !== "Open Data");
  }

  return items;
}
