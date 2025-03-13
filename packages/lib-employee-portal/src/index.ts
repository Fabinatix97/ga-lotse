/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export { type BaseEntity, mapBaseEntity } from "./api/models/BaseEntity";
export {
  type PaginatedList,
  mapPaginatedList,
} from "./api/models/PaginatedList";
export { mapOptional } from "./api/models/mapOptional";
export { type Versioned, mapVersioned } from "./api/models/Versioned";

export { MainContentLayout } from "./components/layout/MainContentLayout";
export { StickyToolbarLayout } from "./components/layout/StickyToolbarLayout";

export { BottomToolbar } from "./components/toolbar/BottomToolbar";
export { Toolbar, type ToolbarProps } from "./components/toolbar/Toolbar";
export { type TabNavigationItem } from "./components/tabNavigationToolbar/TabNavigation";
export {
  TabNavigationToolbar,
  TabNavigationBackButton,
} from "./components/tabNavigationToolbar/TabNavigationToolbar";
export {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "./components/tabNavigationToolbar/TabNavigationHeader";
export { PersonToolbarHeader } from "./components/tabNavigationToolbar/PersonToolbarHeader";

export { EmployeePortalProvider } from "./contexts/employeePortal";
export { useLayoutConfig, type LayoutConfig } from "./contexts/layoutConfig";

export {
  checkAccess,
  hasAllUserRoles,
  hasAnyUserRoles,
  hasUserRole,
  noCheck,
  type AccessCheck,
  type AccessCheckContext,
  type PermitCheck,
  type UserRoleCheck,
} from "./features/auth/accessChecks";
export { useGetSelfUser } from "./features/auth/queries";
export {
  useAccessControl,
  useHasUserRoleCheck,
  useHasUserRolesCheck,
} from "./features/auth/useAccessControl";

export {
  parseImportResult,
  type ImportDataResult,
} from "./features/import/parseImportResult";
export { type ImportStatistics } from "./features/import/ImportStatistics";

export { useHeaderHeights } from "./hooks/useHeaderHeights";

export type { ModuleUserGroupConfig } from "./types/module";
export type {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationLinkItem,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
  SideNavigationParentItem,
} from "./types/sideNavigation";
