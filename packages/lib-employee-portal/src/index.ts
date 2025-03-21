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
export {
  type DefaultPersonFormValues,
  type PersonFormValues,
  mapReferencePersonToForm,
  mapToPersonUpdateRequest,
  mapToPersonAddRequest,
  normalizeListInputs,
} from "./features/personSidebar/types";
export {
  type BaseAddress,
  type BaseAddressType,
  type TaggedDomesticAddress,
  type TaggedPostboxAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "./api/models/address";
export {
  type BaseAddressFormInputs,
  createEmptyAddress,
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "./components/form/address/helpers";

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
export { PageGrid } from "./components/page/PageGrid";
export { ContentPanel } from "./components/contentPanel/ContentPanel";
export { ContentPanelTitle } from "./components/contentPanel/ContentPanelTitle";
export {
  DetailsSection,
  type SimplifiedModalProps,
} from "./components/detailsSection/DetailsSection";
export { DetailsColumn } from "./components/detailsSection/DetailsColumn";
export { DetailsRow } from "./components/detailsSection/DetailsRow";
export {
  DetailsItem,
  type DetailsItemProps,
} from "./components/detailsSection/items/DetailsItem";
export { ExternalLinkDetailsItem } from "./components/detailsSection/items/ExternalLinkDetailsItem";
export { DetailsSectionHeader } from "./components/detailsSection/DetailsSectionHeader";
export { ResponsiveDivider } from "./components/ResponsiveDivider";
export { BaseAddressDetailsColumn } from "./components/address/BaseAddressDetailsColumn";
export { NoEntriesMessage } from "./components/NoEntriesMessage";
export { IconButton } from "./components/buttons/IconButton";

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
export { CentralFilePersonDetails } from "./features/centralFile/CentralFilePersonDetails";

export {
  parseImportResult,
  type ImportDataResult,
} from "./features/import/parseImportResult";
export { type ImportStatistics } from "./features/import/ImportStatistics";

export { TablePage } from "./features/table/components/TablePage";
export { TableSheet } from "./features/table/components/TableSheet";
export { DataTable } from "./features/table/components/DataTable";
export {
  Pagination,
  type PaginationProps,
} from "./features/table/components/pagination/Pagination";
export {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
} from "./features/table/components/toolbars/rowSelectionToolbar";
export { usePagination } from "./features/table/hooks/usePagination";
export {
  useRowSelection,
  useSyncRowSelection,
  mapRowSelectionToRowIds,
} from "./features/table/hooks/useRowSelection";
export {
  useTableControl,
  type UseTableControlResult,
} from "./features/table/hooks/useTableControl";
export { useTableSorting } from "./features/table/hooks/useTableSorting";
export { getSortKey, getSortDirection } from "@/features/table/utils/sorting";
export type {
  TableSortingProps,
  ManualTableSortingProps,
} from "./features/table/types/tableSorting";
export { type SubRowColumns } from "./features/table/types/subRowColumns";
export { OffsetPagination } from "./features/table/components/pagination/OffsetPagination";

export { useHeaderHeights } from "./hooks/useHeaderHeights";
export {
  useReplaceSearchParams,
  type SearchParamReplacement,
} from "./hooks/useReplaceSearchParams";

export type { ModuleUserGroupConfig } from "./types/module";
export type {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationLinkItem,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
  SideNavigationParentItem,
} from "./types/sideNavigation";
