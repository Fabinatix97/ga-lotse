/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import {
  hasUserRole,
  noCheck,
} from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@eshg/lib-employee-portal/types/sideNavigation";
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

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";

import { routes } from "./shared/routes";

const dashboardItem: SideNavigationItem[] = [
  {
    name: "Dashboard",
    href: routes.index,
    decorator: <DashboardOutlined />,
    accessCheck: noCheck(),
  },
];

export function useDashboardItem(): UseSideNavigationItemsResult[] {
  const items = dashboardItem;

  return [{ isLoading: false, items }];
}

/**
 * These are the side navigation items of base module pages.
 * Navigation items of business module pages are defined in their respective files and must not be added here.
 */
const sideNavigationItems: SideNavigationItem[] = [
  {
    name: "DSGVO",
    href: routes.gdpr.index,
    decorator: <GppGoodOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseGdprProcedureRead),
  },
  {
    name: "Benutzer",
    href: routes.users.index,
    decorator: <PeopleAltOutlined />,
    accessCheck: noCheck(),
  },
  {
    name: "Kalender",
    href: routes.calendar,
    decorator: <CalendarTodayOutlined />,
    accessCheck: noCheck(),
  },
  {
    name: "Ressourcen",
    href: routes.resources.index,
    decorator: <WarehouseOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseResourcesRead),
  },
  {
    name: "Inventar",
    href: routes.inventory.index,
    decorator: <InventoryOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseInventoryRead),
  },
  {
    name: "Kontakte",
    href: routes.contacts.index,
    decorator: <ContactsOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseContactsRead),
  },
  {
    name: "Kennzahlen",
    href: routes.metrics.index,
    decorator: <TrackChangesOutlined />,
    accessCheck: hasUserRole(ApiUserRole.BaseProcedureMetricsRead),
  },
  {
    name: "Auditlog",
    href: routes.auditlog.index,
    decorator: <ContentPasteSearchOutlined />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogDecryptAndAccess),
  },
  {
    name: "Auditlog Freigabe",
    href: routes.auditlog.authorize,
    decorator: <ContentPasteSearch />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogAuthorizeAccess),
  },
  {
    name: "Open Data",
    href: routes.opendata.index,
    decorator: <PermMediaOutlined />,
    accessCheck: hasUserRole(ApiUserRole.OpenDataAdmin),
  },
  {
    name: "Posteingang",
    href: routes.inbox,
    decorator: <MailOutline />,
    accessCheck: hasUserRole(ApiUserRole.InboxProcedureWrite),
  },
];

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const isGdprEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Gdpr);
  const isOpenDataEnabled = useIsNewFeatureEnabled(ApiBaseFeature.OpenData);

  let items = sideNavigationItems;
  if (!isGdprEnabled) {
    items = items.filter((item) => item.name !== "DSGVO");
  }
  if (!isOpenDataEnabled) {
    items = items.filter((item) => item.name !== "Open Data");
  }

  return { isLoading: false, items };
}
