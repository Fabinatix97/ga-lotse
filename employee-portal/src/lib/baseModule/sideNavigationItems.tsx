/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  CalendarMonth,
  Contacts,
  ContentPasteSearch,
  EmailSharp,
  Group,
  ListAlt,
  Policy,
  SpaceDashboard,
  Speed,
  Warehouse,
} from "@mui/icons-material";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { SideNavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole, noCheck } from "@/lib/shared/helpers/accessControl";

import { routes } from "./shared/routes";

/**
 * These are the side navigation items of base module pages.
 * Navigation items of business module pages are defined in their respective files and must not be added here.
 */
const sideNavigationItems: SideNavigationItem[] = [
  {
    name: "Dashboard",
    href: routes.index,
    decorator: <SpaceDashboard color="neutral" />,
    accessCheck: noCheck(),
  },
  {
    name: "DSGVO",
    href: routes.gdpr.index,
    decorator: <Policy />,
    accessCheck: hasUserRole(ApiUserRole.BaseGdprProcedureRead),
  },
  {
    name: "Benutzer",
    href: routes.users.index,
    decorator: <Group />,
    accessCheck: noCheck(),
  },
  {
    name: "Kalender",
    href: routes.calendar,
    decorator: <CalendarMonth />,
    accessCheck: noCheck(),
  },
  {
    name: "Ressourcen",
    href: routes.resources.index,
    decorator: <Warehouse />,
    accessCheck: hasUserRole(ApiUserRole.BaseResourcesRead),
  },
  {
    name: "Inventar",
    href: routes.inventory.index,
    decorator: <ListAlt />,
    accessCheck: hasUserRole(ApiUserRole.BaseInventoryRead),
  },
  {
    name: "Kontakte",
    href: routes.contacts.index,
    decorator: <Contacts />,
    accessCheck: hasUserRole(ApiUserRole.BaseContactsRead),
  },
  {
    name: "Kennzahlen",
    href: routes.metrics,
    decorator: <Speed />,
    accessCheck: hasUserRole(ApiUserRole.BaseProcedureMetricsRead),
  },
  {
    name: "Auditlog",
    href: routes.auditlog.index,
    decorator: <ContentPasteSearch />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogDecryptAndAccess),
  },
  {
    name: "Auditlog Freigabe",
    href: routes.auditlog.authorize.index,
    decorator: <ContentPasteSearch />,
    accessCheck: hasUserRole(ApiUserRole.AuditlogAuthorizeAccess),
  },
];

const inboxNavigationItem: SideNavigationItem[] = [
  {
    name: "Posteingang",
    href: routes.inbox,
    decorator: <EmailSharp />,
    accessCheck: hasUserRole(ApiUserRole.InboxProcedureWrite),
  },
];

export function useSideNavigationItems(): SideNavigationItem[] {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);
  return isInboxEnabled
    ? sideNavigationItems.concat(inboxNavigationItem)
    : sideNavigationItems;
}
