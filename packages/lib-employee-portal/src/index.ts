/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export { type BaseEntity, mapBaseEntity, getId } from "./api/models/BaseEntity";
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
export { useGetUsersByGroupQuery } from "./api/queries/users";

export {
  createEmptyAddress,
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "./components/address/helpers";
export { MultiFormButtonBar } from "./components/form/MultiFormButtonBar";
export { CountryField } from "./components/formFields/CountryField";
export {
  type BaseAddressFormInputs,
  ContactAddressForm,
  BillingAddressForm,
  OptionalBillingAddressForm,
  OptionalContactAddressForm,
} from "./components/address/addressForms";
export { ResettableSingleSelect } from "./components/select/ResettableSingleSelect";
export { MainContentLayout } from "./components/layout/MainContentLayout";
export { StickyToolbarLayout } from "./components/layout/StickyToolbarLayout";
export { InformationSheet } from "./components/content/InformationSheet";

export { BottomToolbar } from "./components/toolbar/BottomToolbar";
export { Toolbar, type ToolbarProps } from "./components/toolbar/Toolbar";
export { ToolbarBackButton } from "./components/toolbar/ToolbarBackButton";
export { type TabNavigationItem } from "./components/tabNavigationToolbar/TabNavigation";
export { TabNavigationToolbar } from "./components/tabNavigationToolbar/TabNavigationToolbar";
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
export { DetailsItem } from "./components/detailsSection/items/DetailsItem";
export { ExternalLinkDetailsItem } from "./components/detailsSection/items/ExternalLinkDetailsItem";
export { DetailsSectionHeader } from "./components/detailsSection/DetailsSectionHeader";
export { ResponsiveDivider } from "./components/ResponsiveDivider";
export { BaseAddressDetailsColumn } from "./components/address/BaseAddressDetailsColumn";
export { NoEntriesMessage } from "./components/NoEntriesMessage";
export { IconButton } from "./components/buttons/IconButton";
export { EditButton } from "./components/buttons/EditButton";
export { ButtonBar } from "./components/buttons/ButtonBar";
export { OpenModalButton } from "./components/buttons/OpenModalButton";
export { SelectableCard } from "./components/cards/SelectableCard";
export {
  CustomFileType,
  FileCard,
  type FileCardProps,
  type FileCardActionProps,
} from "./components/cards/FileCard";
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
export { DateTimeField } from "./components/formFields/DateTimeField";
export { UserField, type NamedUser } from "./components/formFields/UserField";
export { ConfirmationDialog } from "./components/confirmationDialog/ConfirmationDialog";
export { FormSheet } from "./components/form/FormSheet";
export {
  ToggleExpandButton,
  type ToggleExpandButtonProps,
} from "./components/buttons/ToggleExpandButton";
export {
  PersonSearchForm,
  usePersonSearch,
  type PersonSearchFormValues,
  type PersonSearchParams,
} from "./components/personSearch/PersonSearchForm";
export { TogglePersonSearchButton } from "./components/personSearch/TogglePersonSearchButton";
export {
  ActionsMenu,
  type ActionsItem,
} from "./components/buttons/ActionsMenu";
export { FormDialog } from "./components/form/FormDialog";
export { FormStack } from "./components/form/FormStack";
export {
  SearchableGroups,
  type SearchableGroup,
  type SearchableGroupItem,
} from "./components/searchableGroups/SearchableGroups";
export { Timeline } from "./components/timeline/Timeline";
export {
  TimelineEntry,
  type TimelineEntryProps,
} from "./components/timeline/TimelineEntry";
export { TimelineEntryIndicator } from "./components/timeline/TimelineEntryIndicator";

export { PROCEDURE_STATUS_COLORS } from "./config/procedures";

export { EmployeePortalProvider } from "./contexts/employeePortal";
export { useLayoutConfig, type LayoutConfig } from "./contexts/layoutConfig";
export { useSidenav } from "./contexts/sidenav";

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
export { CentralFilePersonDetails } from "./components/centralFile/CentralFilePersonDetails";

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
export { getSortKey, getSortDirection } from "./features/table/utils/sorting";
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
export { useSidenavDrawer } from "./features/drawer/hooks/useSidenavDrawer";

export {
  ProcedureLabelFormFields,
  type ProcedureLabelValues,
} from "./features/procedureLabels/components/ProcedureLabelFormFields";
export { ProcedureLabelsPage } from "./features/procedureLabels/components/ProcedureLabelsPage";
export { ProcedureLabelAutocomplete } from "./features/procedureLabels/components/ProcedureLabelAutocomplete";
export { ProcedureLabelSelection } from "./features/procedureLabels/components/ProcedureLabelSelection";
export { ProcedureLabelChip } from "./features/procedureLabels/components/ProcedureLabelChip";

export {
  ToggleFilterButton,
  type ToggleFilterButtonProps,
} from "./features/filters/components/filterSettings/ToggleFilterButton";
export {
  ActiveFilter,
  type ActiveFilterProps,
} from "./features/filters/components/filterSettings/ActiveFilter";
export { FilterSettings } from "./features/filters/components/filterSettings/FilterSettings";
export {
  FilterSettingsContent,
  type FilterSettingsContentProps,
} from "./features/filters/components/filterSettings/FilterSettingsContent";
export {
  FilterSettingsSheet,
  type FilterSettingsSheetProps,
} from "./features/filters/components/filterSettings/FilterSettingsSheet";
export type {
  FilterTemplate,
  FilterTemplatesProps,
} from "./features/filters/components/filterSettings/FilterTemplates";
export { defaultDraftValueDateComparisonFilter } from "./features/filters/components/filterFields/DateComparisonFilter";
export { EnumFilter } from "./features/filters/components/filterFields/EnumFilter";
export { NumberFilter } from "./features/filters/components/filterFields/NumberFilter";
export { SearchInstitutionFilter } from "./features/filters/components/filterFields/SearchInstitutionFilter";
export {
  useFilterSettings,
  type UseFilterSettings,
  type UseFilterSettingsParams,
  type FilterSettingsStateProvider,
} from "./features/filters/hooks/useFilterSettings";
export {
  useFilterDictionary,
  type SetDictionaryFilterFn,
} from "./features/filters/hooks/useFilterDictionary";
export type { FilterDefinition } from "./features/filters/types/FilterDefinition";
export type { FilterValue } from "./features/filters/types/FilterValue";
export type { DateComparisonOperator } from "./features/filters/types/DateComparisonFilter";
export type { DateSpanFilterValue } from "./features/filters/types/DateSpanFilter";
export type {
  EnumFilterValue,
  EnumFilterDefinition,
  EnumFilterOption,
} from "./features/filters/types/EnumFilter";
export {
  type NumberFilterDefinition,
  type NumberFilterValue,
  type NumberFilterValueComparison,
  type NumberFilterOnlyNullComparison,
  type NumberFilterRangeComparison,
  NumberFilterComparisonMode,
  NumberFilterNullInclusion,
  NumberFilterNumericComparison,
} from "./features/filters/types/NumberFilter";
export type {
  TextFilterDefinition,
  TextFilterValue,
} from "./features/filters/types/TextFilter";
export { getDefinitionByValue } from "./features/filters/utils/getDefinitionByValue";
export { getSelectedEnumFilterValues } from "./features/filters/utils/getSelectedEnumFilterValues";

export { gdprRoutes } from "./features/gdpr/config/gdprRoutes";
export { useGetGdprValidationBannerQuery } from "./features/gdpr/api/queries";
export { useGdprValidationTasksAlert } from "./features/gdpr/hooks/useGdprValidationTasksAlert";

export { FormButtonBar } from "./components/form/FormButtonBar";
export { FormFooter } from "./components/form/FormFooter";
export { OverlayBoundary } from "./components/boundaries/OverlayBoundary";
export { EmployeePortalErrorModal } from "./components/boundaries/EmployeePortalErrorModal";

export { ChipWithTooltip } from "./components/chip/ChipWithTooltip";

export { CONTACT_CATEGORY_NAMES } from "./features/contacts/translations";
export {
  type Contact,
  isPersonContact,
  isInstitutionContact,
} from "./features/contacts/api/models/Contact";
export {
  useSearchContactsQuery,
  useGetContactQuery,
} from "./features/contacts/api/queries";
export { SearchContactField } from "./features/contacts/components/SearchContactField";
export { SelectContactField } from "./features/contacts/components/SelectContactField";
export { SelectMultipleContactsField } from "./features/contacts/components/SelectMultipleContactsField";
export { formatInstitutionNameWithCategoryShort } from "./features/contacts/utils/formatters";

export type {
  PersonFormValues,
  PersonFormProps,
} from "./features/persons/types/personForm";
export { PersonCardContent } from "./features/persons/components/PersonCardContent";
export {
  type DefaultPersonFormValues,
  DefaultPersonForm,
  defaultPersonFormValues,
} from "./features/persons/components/form/DefaultPersonForm";
export { PersonSidebarForm } from "./features/persons/components/form/PersonSidebarForm";
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
} from "./features/persons/components/sidebar/PersonSidebar";
export { PersonDetailsSidebar } from "./features/persons/components/sidebar/PersonDetailsSidebar";
export { SyncBarrier } from "./features/persons/components/syncBarrier/SyncBarrier";
export { useSyncBarrier } from "./features/persons/hooks/useSyncBarrier";
export { CentralFileSyncForm } from "./features/persons/components/personSync/CentralFileSyncForm";
export { BasePersonDiffForm } from "./features/persons/components/personSync/sections/BasePersonDiffForm";
export { BaseFacilityDiffForm } from "./features/persons/components/personSync/sections/BaseFacilityDiffForm";
export { useEditReferencePersonSidebar } from "./features/persons/components/sidebar/EditReferencePersonSidebar";
export {
  useSearchReferencePersonsQuery,
  useGetPersonFileStateDiff,
  useSearchReferenceFacilitiesQuery,
  useGetFacilityFileStateDiff,
} from "./features/persons/api/queries";
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
export { useIsOffline } from "./hooks/useIsOffline";

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
  formatDurationFromNowUntil,
} from "./utils/formatters";
export { mapToSelectOption } from "./utils/mappers";
export { getDateFnsLocale } from "./utils/dateTime";
