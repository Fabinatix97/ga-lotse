/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export { type BaseEntity, mapBaseEntity } from "./api/models/BaseEntity";
export {
  type PaginatedList,
  mapPaginatedList,
} from "./api/models/PaginatedList";
export {
  type ProcedureLabel,
  mapProcedureLabels,
} from "./features/procedureLabels/api/models/ProcedureLabel";
export { mapOptional } from "./api/models/mapOptional";
export { type Versioned, mapVersioned } from "./api/models/Versioned";
export {
  type BaseAddress,
  type BaseAddressType,
  type TaggedDomesticAddress,
  type TaggedPostboxAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "./api/models/address";
export {
  createEmptyAddress,
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@/components/address/helpers";
export { MultiFormButtonBar } from "./components/form/MultiFormButtonBar";
export { CountryField } from "./components/formFields/CountryField";
export {
  type BaseAddressFormInputs,
  ContactAddressForm,
  BillingAddressForm,
  OptionalBillingAddressForm,
  OptionalContactAddressForm,
} from "./components/address/addressForms";

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
export { BaseAddressDetailsColumn } from "@/components/address/BaseAddressDetailsColumn";
export { NoEntriesMessage } from "./components/NoEntriesMessage";
export { IconButton } from "./components/buttons/IconButton";
export { EditButton } from "./components/buttons/EditButton";
export { ButtonBar } from "./components/buttons/ButtonBar";
export { SelectableCard } from "./components/cards/SelectableCard";
export { NoSearchResults } from "./components/NoSearchResults";
export {
  SchoolYearAutocomplete,
  SchoolYearField,
} from "./components/formFields/schoolYear";
export {
  FileField,
  type FileFieldProps,
} from "./components/formFields/file/FileField";
export { DeletableFileField } from "./components/formFields/file/DeletableFileField";

export { PROCEDURE_STATUS_COLORS } from "./config/procedures";

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
} from "./features/auth/utils/accessChecks";
export { useGetSelfUser } from "./features/auth/api/queries";
export {
  useAccessControl,
  useHasUserRoleCheck,
  useHasUserRolesCheck,
} from "./features/auth/hooks/useAccessControl";
export { CentralFilePersonDetails } from "@/components/centralFile/CentralFilePersonDetails";

export { ImportDataForm } from "./features/import/components/ImportDataForm";
export {
  parseImportResult,
  type ImportDataResult,
} from "./features/import/utils/parseImportResult";
export {
  formatDuplicatedRecordCount,
  formatFaultyRecordCount,
  formatTotalRecordCount,
} from "./features/import/utils/formatters";

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

export { DrawerProvider } from "./features/drawer/contexts/drawer";
export { SidebarScope } from "./features/drawer/contexts/sidebarScope";
export { SIDEBAR_PADDING } from "./features/drawer/config/sidebar";
export type {
  DrawerProps,
  DrawerOpenOptions,
} from "./features/drawer/types/drawer";
export type { SidebarFormHandle } from "./features/drawer/types/sidebar";
export {
  Sidebar,
  type SidebarProps,
} from "./features/drawer/components/Sidebar";
export { SidebarContent } from "./features/drawer/components/SidebarContent";
export { SidebarActions } from "./features/drawer/components/SidebarActions";
export {
  SidebarForm,
  useSidebarFormHandle,
} from "./features/drawer/components/SidebarForm";
export { SidebarSlot } from "./features/drawer/components/SidebarSlot";
export {
  useSidebar,
  type UseSidebarResult,
} from "./features/drawer/hooks/useSidebar";
export {
  useSidebarWithFormRef,
  type SidebarWithFormRefProps,
  type UseSidebarWithFormRefResult,
} from "./features/drawer/hooks/useSidebarWithFormRef";
export { useSidenav } from "./features/drawer/hooks/useSidenav";

export {
  ProcedureLabelFormFields,
  type ProcedureLabelValues,
} from "@/features/procedureLabels/components/ProcedureLabelFormFields";
export { ProcedureLabelsPage } from "@/features/procedureLabels/components/ProcedureLabelsPage";
export { ProcedureLabelAutocomplete } from "@/features/procedureLabels/components/ProcedureLabelAutocomplete";
export { ProcedureLabelSelection } from "@/features/procedureLabels/components/ProcedureLabelSelection";
export {
  TextareaField,
  type TextareaFieldProps,
} from "./components/form/TextareaField";
export { FormButtonBar } from "./components/form/FormButtonBar";
export { OverlayBoundary } from "./components/boundaries/OverlayBoundary";
export { EmployeePortalErrorModal } from "./components/boundaries/EmployeePortalErrorModal";

export { ChipWithTooltip } from "./components/chip/ChipWithTooltip";

export { SyncBarrier } from "./features/sync/components/SyncBarrier";
export { useSyncBarrier } from "./features/sync/hooks/useSyncBarrier";

export { CONTACT_CATEGORY_NAMES } from "./features/contacts/translations";
export {
  type Contact,
  isPersonContact,
  isInstitutionContact,
} from "./features/contacts/api/models/Contact";
export {
  useSearchContactsQuery,
  useGetOptionalContactQuery,
} from "./features/contacts/api/queries";
export { SearchContactField } from "./features/contacts/components/SearchContactField";
export { SelectContactField } from "./features/contacts/components/SelectContactField";
export { SelectMultipleContactsField } from "./features/contacts/components/SelectMultipleContactsField";
export { formatInstitutionNameWithCategoryShort } from "./features/contacts/utils/formatters";
export { mapContactToSelectOption } from "./features/contacts/utils/mappers";

export type {
  PersonFormValues,
  PersonFormProps,
} from "./features/persons/types/personForm";
export { PersonCardContent } from "./features/persons/components/PersonCardContent";
export {
  type DefaultPersonFormValues,
  DefaultPersonForm,
  defaultPersonFormValues,
} from "@/features/persons/components/form/DefaultPersonForm";
export { PersonSidebarForm } from "@/features/persons/components/form/PersonSidebarForm";
export {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "./features/persons/components/search/DefaultSearchPersonForm";
export { DefaultSearchPersonFormFields } from "./features/persons/components/search/DefaultSearchPersonFormFields";
export {
  type SearchPersonFormProps,
  type SearchPersonFormValues,
} from "./features/persons/components/search/SearchPersonSidebar";
export { PersonSearchResults } from "./features/persons/components/search/PersonSearchResults";
export {
  PersonSidebar,
  type PersonSidebarProps,
} from "@/features/persons/components/sidebar/PersonSidebar";
export { PersonDetailsSidebar } from "@/features/persons/components/sidebar/PersonDetailsSidebar";
export { useEditReferencePersonSidebar } from "@/features/persons/components/sidebar/EditReferencePersonSidebar";
export { useSearchReferencePersonsQuery } from "./features/persons/api/queries";
export {
  mapReferencePersonToForm,
  mapToPersonUpdateRequest,
  mapToPersonAddRequest,
  normalizeListInputs,
} from "./features/persons/utils/mappers";

export { useHeaderHeights } from "./hooks/useHeaderHeights";
export {
  useReplaceSearchParams,
  type SearchParamReplacement,
} from "./hooks/useReplaceSearchParams";
export { useConfirmationDialog } from "./hooks/useConfirmationDialog";
export { useResetAlertContextOnChange } from "./hooks/useResetAlertContextOnChange";

export type { ModuleUserGroupConfig } from "./types/module";
export type {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationLinkItem,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
  SideNavigationParentItem,
} from "./types/sideNavigation";

export { PROCEDURE_STATUS_NAMES } from "./translations/procedures";

export {
  formatBoolean,
  formatList,
  formatSchoolYear,
  createCountFormatter,
} from "./utils/formatters";
export { mapToSelectOption } from "./utils/mappers";
