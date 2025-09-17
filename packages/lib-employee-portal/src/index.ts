/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export {
  type BaseEntity,
  getEntityId,
  mapBaseEntity,
} from "./api/models/BaseEntity";
export {
  type PaginatedList,
  mapPaginatedList,
} from "./api/models/PaginatedList";
export { type Versioned, mapVersioned } from "./api/models/Versioned";
export {
  type BaseAddress,
  type BaseAddressType,
  type TaggedDomesticAddress,
  type TaggedPostboxAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "./api/models/address";
export { mapOptional } from "./api/models/mapOptional";
export { useGetPublicConfig } from "./api/queries/publicConfig";
export { useGetUsersByGroupQuery } from "./api/queries/users";
export type { ApiConfiguration } from "./api/config";

export { NoEntriesMessage } from "./components/NoEntriesMessage";
export { NoSearchResults } from "./components/NoSearchResults";
export { ResponsiveDivider } from "./components/ResponsiveDivider";
export { BaseAddressDetailsColumn } from "./components/address/BaseAddressDetailsColumn";
export {
  type BaseAddressFormInputs,
  BillingAddressForm,
  ContactAddressForm,
  OptionalBillingAddressForm,
  OptionalContactAddressForm,
} from "./components/address/addressForms";
export {
  createEmptyAddress,
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "./components/address/helpers";
export {
  type AppointmentBlock,
  type AppointmentBlockGroup,
} from "./components/appointmentBlocks/AppointmentBlockGroup";
export { useAppointmentBlockGroupsColumns } from "./components/appointmentBlocks/AppointmentBlockGroupsTable.columns";
export {
  INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  type AppointmentBlockRow,
  AppointmentBlockGroupsTable,
} from "./components/appointmentBlocks/AppointmentBlockGroupsTable";
export { AppointmentBlockFieldArrayWithDays } from "./components/appointmentBlocks/AppointmentBlockFieldArrayWithDays";
export {
  AppointmentBlockFormWithDays,
  type AppointmentBlockGroupValuesWithDays,
  WEEKDAY_TYPES,
  type WeekdayCheckboxOption,
  emptyAppointmentBlockGroup,
  getWeekdayFromDate,
} from "./components/appointmentBlocks/AppointmentBlockFormWithDays";
export { AppointmentBlockGroupFields } from "./components/appointmentBlocks/AppointmentBlockGroupFields";
export { AppointmentLocationSelection } from "./components/appointmentBlocks/AppointmentLocationSelection";
export {
  calculateAppointmentsPerBlock,
  getAppointmentDurationInMinutes,
  type AppointmentBlockGroupValues,
} from "./components/appointmentBlocks/calculateAppointmentCount";
export { AppointmentStaffSelection } from "./components/appointmentBlocks/AppointmentStaffSelection";
export { WeekdayCheckboxGroup } from "./components/appointmentBlocks/WeekdayCheckboxGroup";
export {
  ApiAppointmentType,
  ApiDayOfWeek,
} from "./components/appointmentBlocks/types";
export {
  validateAppointmentBlock,
  type ExaminationDurations,
} from "./components/appointmentBlocks/validateAppointmentBlock";
export { EmployeePortalErrorModal } from "./components/boundaries/EmployeePortalErrorModal";
export { OverlayBoundary } from "./components/boundaries/OverlayBoundary";
export {
  type ActionsItem,
  ActionsMenu,
} from "./components/buttons/ActionsMenu";
export { ButtonBar } from "./components/buttons/ButtonBar";
export { EditButton } from "./components/buttons/EditButton";
export { IconButton } from "./components/buttons/IconButton";
export { OpenModalButton } from "./components/buttons/OpenModalButton";
export {
  ToggleExpandButton,
  type ToggleExpandButtonProps,
} from "./components/buttons/ToggleExpandButton";
export {
  CustomFileType,
  FileCard,
  type FileCardActionProps,
  type FileCardProps,
  mapToFileCardProps,
} from "./components/cards/FileCard";
export { SelectableCard } from "./components/cards/SelectableCard";
export { CentralFilePersonDetails } from "./components/centralFile/CentralFilePersonDetails";
export { ChipWithTooltip } from "./components/chip/ChipWithTooltip";
export { ConfirmationDialog } from "./components/confirmationDialog/ConfirmationDialog";
export { InformationSheet } from "./components/content/InformationSheet";
export { ContentPanel } from "./components/contentPanel/ContentPanel";
export { ContentPanelTitle } from "./components/contentPanel/ContentPanelTitle";
export { DetailsRow } from "./components/detailsSection/DetailsRow";
export {
  DetailsSection,
  type SimplifiedModalProps,
} from "./components/detailsSection/DetailsSection";
export { DetailsSectionHeader } from "./components/detailsSection/DetailsSectionHeader";
export { DetailsItem } from "./components/detailsSection/items/DetailsItem";
export { ExternalLinkDetailsItem } from "./components/detailsSection/items/ExternalLinkDetailsItem";
export { FormButtonBar } from "./components/form/FormButtonBar";
export { FormDialog } from "./components/form/FormDialog";
export { FormFooter } from "./components/form/FormFooter";
export { FormSheet } from "./components/form/FormSheet";
export { FormStack } from "./components/form/FormStack";
export { MultiFormButtonBar } from "./components/form/MultiFormButtonBar";
export { CountryField } from "./components/formFields/CountryField";
export { DateTimeField } from "./components/formFields/DateTimeField";
export { TimeField } from "./components/formFields/TimeField";
export { type NamedUser, UserField } from "./components/formFields/UserField";
export { DeletableFileField } from "./components/formFields/file/DeletableFileField";
export {
  FileField,
  type FileFieldProps,
} from "./components/formFields/file/FileField";
export {
  SchoolYearAutocomplete,
  SchoolYearField,
} from "./components/formFields/schoolYear";
export { MainContentLayout } from "./components/layout/MainContentLayout";
export { StickyToolbarLayout } from "./components/layout/StickyToolbarLayout";
export { PageGrid } from "./components/page/PageGrid";
export { RestrictedPage } from "./components/page/RestrictedPage";
export {
  PersonSearchForm,
  type PersonSearchFormValues,
  type PersonSearchParams,
  usePersonSearch,
  usePersonSearchFromURL,
} from "./components/personSearch/PersonSearchForm";
export { TogglePersonSearchButton } from "./components/personSearch/TogglePersonSearchButton";
export {
  type SearchableGroup,
  type SearchableGroupItem,
  SearchableGroups,
} from "./components/searchableGroups/SearchableGroups";
export { ResettableSingleSelect } from "./components/select/ResettableSingleSelect";
export { PersonToolbarHeader } from "./components/tabNavigationToolbar/PersonToolbarHeader";
export { type TabNavigationItem } from "./components/tabNavigationToolbar/TabNavigation";
export {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "./components/tabNavigationToolbar/TabNavigationHeader";
export { TabNavigationToolbar } from "./components/tabNavigationToolbar/TabNavigationToolbar";
export { Timeline } from "./components/timeline/Timeline";
export {
  TimelineEntry,
  type TimelineEntryProps,
} from "./components/timeline/TimelineEntry";
export { TimelineEntryIndicator } from "./components/timeline/TimelineEntryIndicator";
export { BottomToolbar } from "./components/toolbar/BottomToolbar";
export { Toolbar, type ToolbarProps } from "./components/toolbar/Toolbar";
export { ToolbarBackButton } from "./components/toolbar/ToolbarBackButton";

export { publicConfigApiQueryKey } from "./config/apiQueryKeys";
export { PROCEDURE_STATUS_COLORS } from "./config/procedures";

export { EmployeePortalProvider } from "./contexts/employeePortal";
export { type LayoutConfig, useLayoutConfig } from "./contexts/layoutConfig";
export { useSidenav } from "./contexts/sidenav";

export { ArchivePage } from "./features/archiving/components/archive/ArchivePage";
export { ArchiveAdminPage } from "./features/archiving/components/archiveAdmin/ArchiveAdminPage";
export { useArchivingSideNavigationItems } from "./features/archiving/config/sideNavigationItem";

export { useGetSelfUser } from "./features/auth/api/queries";
export {
  useAccessControl,
  useHasUserRoleCheck,
  useHasUserRolesCheck,
} from "./features/auth/hooks/useAccessControl";
export {
  type AccessCheck,
  type AccessCheckContext,
  type PermitCheck,
  type UserRoleCheck,
  checkAccess,
  hasAllUserRoles,
  hasAnyUserRoles,
  hasUserRole,
  noCheck,
} from "./features/auth/utils/accessChecks";

export {
  type Contact,
  isInstitutionContact,
  isPersonContact,
} from "./features/contacts/api/models/Contact";
export {
  useGetContactQueryOptions,
  useSearchContactsQuery,
} from "./features/contacts/api/queries";
export { SearchContactField } from "./features/contacts/components/SearchContactField";
export { SelectContactField } from "./features/contacts/components/SelectContactField";
export { SelectMultipleContactsField } from "./features/contacts/components/SelectMultipleContactsField";
export { CONTACT_CATEGORY_NAMES } from "./features/contacts/translations";
export {
  formatSubCategory,
  getSubCategories,
  hasSubCategories,
} from "./features/contacts/utils/categories";
export { formatInstitutionNameWithCategoryShort } from "./features/contacts/utils/formatters";

export {
  Sidebar,
  type SidebarProps,
} from "./features/drawer/components/Sidebar";
export { SidebarActions } from "./features/drawer/components/SidebarActions";
export { SidebarContent } from "./features/drawer/components/SidebarContent";
export {
  SidebarForm,
  useSidebarFormHandle,
} from "./features/drawer/components/SidebarForm";
export { SidebarSlot } from "./features/drawer/components/SidebarSlot";
export { SIDEBAR_PADDING } from "./features/drawer/config/sidebar";
export { DrawerProvider } from "./features/drawer/contexts/drawer";
export { SidebarScope } from "./features/drawer/contexts/sidebarScope";
export {
  type UseSidebarResult,
  useSidebar,
} from "./features/drawer/hooks/useSidebar";
export { useSidebarFromSearchParam } from "./features/drawer/hooks/useSidebarFromSearchParam";
export {
  type SidebarWithFormRefProps,
  type UseSidebarWithFormRefResult,
  type UseSidebarWithFormRefOptions,
  useSidebarWithFormRef,
} from "./features/drawer/hooks/useSidebarWithFormRef";
export { useSidenavDrawer } from "./features/drawer/hooks/useSidenavDrawer";
export type {
  DrawerOpenOptions,
  DrawerProps,
} from "./features/drawer/types/drawer";
export type { SidebarFormHandle } from "./features/drawer/types/sidebar";

export { type UseStepperArgs, useStepper } from "./hooks/useStepper";

export { defaultDraftValueDateComparisonFilter } from "./features/filters/components/filterFields/DateComparisonFilter";
export { EnumFilter } from "./features/filters/components/filterFields/EnumFilter";
export { NumberFilter } from "./features/filters/components/filterFields/NumberFilter";
export { SearchInstitutionFilter } from "./features/filters/components/filterFields/SearchInstitutionFilter";
export { YearFilter } from "./features/filters/components/filterFields/YearFilter";
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
export {
  ToggleFilterButton,
  type ToggleFilterButtonProps,
} from "./features/filters/components/filterSettings/ToggleFilterButton";
export {
  type SetDictionaryFilterFn,
  usePersistentFilterDictionary,
  useFilterDictionary,
} from "./features/filters/hooks/useFilterDictionary";
export {
  type FilterSettingsStateProvider,
  type UseFilterSettings,
  type UseFilterSettingsParams,
  useFilterSettings,
} from "./features/filters/hooks/useFilterSettings";
export { useQueryParamFilterSettings } from "./features/filters/hooks/useQueryParamFilterSettings";
export { useQueryParamStateProvider } from "./features/filters/hooks/useQueryParamStateProvider";
export type { DateComparisonOperator } from "./features/filters/types/DateComparisonFilter";
export type { DateSpanFilterValue } from "./features/filters/types/DateSpanFilter";
export type {
  EnumFilterDefinition,
  EnumFilterOption,
  EnumFilterValue,
} from "./features/filters/types/EnumFilter";
export type { FilterDefinition } from "./features/filters/types/FilterDefinition";
export type { FilterValue } from "./features/filters/types/FilterValue";
export {
  NumberFilterComparisonMode,
  type NumberFilterDefinition,
  NumberFilterNullInclusion,
  NumberFilterNumericComparison,
  type NumberFilterOnlyNullComparison,
  type NumberFilterRangeComparison,
  type NumberFilterValue,
  type NumberFilterValueComparison,
} from "./features/filters/types/NumberFilter";
export type {
  TextFilterDefinition,
  TextFilterValue,
} from "./features/filters/types/TextFilter";
export {
  getFilterSelectedValue,
  getFilterSelectedValues,
  isInEnum,
} from "./features/filters/utils/filterValues";
export { getDefinitionByValue } from "./features/filters/utils/getDefinitionByValue";
export { getSelectedEnumFilterValues } from "./features/filters/utils/getSelectedEnumFilterValues";

export { useGetGdprValidationBannerQuery } from "./features/gdpr/api/queries";
export { gdprRoutes } from "./features/gdpr/config/gdprRoutes";
export { useGdprValidationTasksAlert } from "./features/gdpr/hooks/useGdprValidationTasksAlert";

export { ImportDataForm } from "./features/import/components/ImportDataForm";
export { UpdateResultSummary } from "./components/UpdateResultSummary";
export {
  formatDuplicatedRecordCount,
  formatFaultyRecordCount,
  formatTotalRecordCount,
} from "./features/import/utils/formatters";
export {
  type ImportDataResult,
  parseImportResult,
} from "./features/import/utils/parseImportResult";

export {
  useGetFacilityFileStateDiff,
  useGetPersonFileStateDiff,
  useSearchReferenceFacilitiesQuery,
  useSearchReferencePersonsQuery,
} from "./features/persons/api/queries";
export { PersonCardContent } from "./features/persons/components/PersonCardContent";
export {
  DefaultPersonForm,
  type DefaultPersonFormValues,
  defaultPersonFormValues,
} from "./features/persons/components/form/DefaultPersonForm";
export { PersonSidebarForm } from "./features/persons/components/form/PersonSidebarForm";
export { CentralFileSyncForm } from "./features/persons/components/personSync/CentralFileSyncForm";
export { BaseFacilityDiffForm } from "./features/persons/components/personSync/sections/BaseFacilityDiffForm";
export { BasePersonDiffForm } from "./features/persons/components/personSync/sections/BasePersonDiffForm";
export {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "./features/persons/components/search/DefaultSearchPersonForm";
export { DefaultSearchPersonFormFields } from "./features/persons/components/search/DefaultSearchPersonFormFields";
export { PersonSearchResults } from "./features/persons/components/search/PersonSearchResults";
export {
  type SearchPersonFormProps,
  type SearchPersonFormValues,
} from "./features/persons/components/search/SearchPersonSidebar";
export { useEditReferencePersonSidebar } from "./features/persons/components/sidebar/EditReferencePersonSidebar";
export { PersonDetailsSidebar } from "./features/persons/components/sidebar/PersonDetailsSidebar";
export {
  PersonSidebar,
  type PersonSidebarProps,
} from "./features/persons/components/sidebar/PersonSidebar";
export { SyncBarrier } from "./features/persons/components/syncBarrier/SyncBarrier";
export { useSyncBarrier } from "./features/persons/hooks/useSyncBarrier";
export type {
  PersonFormProps,
  PersonFormValues,
} from "./features/persons/types/personForm";
export {
  mapReferencePersonToForm,
  mapToPersonAddRequest,
  mapToPersonUpdateRequest,
  normalizeListInputs,
} from "./features/persons/utils/mappers";

export {
  type ProcedureLabel,
  mapProcedureLabels,
} from "./features/procedureLabels/api/models/ProcedureLabel";
export { ProcedureLabelAutocomplete } from "./features/procedureLabels/components/ProcedureLabelAutocomplete";
export { ProcedureLabelChip } from "./features/procedureLabels/components/ProcedureLabelChip";
export {
  ProcedureLabelFormFields,
  type ProcedureLabelValues,
} from "./features/procedureLabels/components/ProcedureLabelFormFields";
export { ProcedureLabelSelection } from "./features/procedureLabels/components/ProcedureLabelSelection";
export { ProcedureLabelsPage } from "./features/procedureLabels/components/ProcedureLabelsPage";

export { ProgressEntriesPage } from "./features/progressEntries/components/ProgressEntriesPage";
export { manualProgressEntryTypeNames } from "./features/progressEntries/config/progressEntryTypes";

export { InboxProceduresPage } from "./features/inboxProcedures/components/InboxProceduresPage";
export { useFetchInboxProcedure } from "./features/inboxProcedures/api/queries";

export { DataTable } from "./features/table/components/DataTable";
export { TablePage } from "./features/table/components/TablePage";
export { TableSheet } from "./features/table/components/TableSheet";
export { OffsetPagination } from "./features/table/components/pagination/OffsetPagination";
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
  mapRowSelectionToRowIds,
  useRowSelection,
  useSyncRowSelection,
} from "./features/table/hooks/useRowSelection";
export {
  type UseTableControlResult,
  useTableControl,
  usePersistentTableControl,
} from "./features/table/hooks/useTableControl";
export { useTableSorting } from "./features/table/hooks/useTableSorting";
export { type SubRowColumns } from "./features/table/types/subRowColumns";
export type {
  ManualTableSortingProps,
  TableSortingProps,
} from "./features/table/types/tableSorting";
export { getSortDirection, getSortKey } from "./features/table/utils/sorting";

export { useConfirmationDialog } from "./hooks/useConfirmationDialog";
export { useConfirmLeaveDirtyFormEffect } from "./hooks/useConfirmLeaveDirtyFormEffect";
export { useHeaderHeights } from "./hooks/useHeaderHeights";
export { useIsOffline } from "./hooks/useIsOffline";
export {
  type SearchParamReplacement,
  useReplaceSearchParams,
} from "./hooks/useReplaceSearchParams";
export { useResetAlertContextOnChange } from "./hooks/useResetAlertContextOnChange";
export {
  setWindowSearchParams,
  updateSearchParam,
  useSearchParam,
  useSearchParamLink,
} from "./hooks/useSearchParam";

export {
  PROCEDURE_STATUS_NAMES,
  PROCEDURE_TYPE_NAMES,
} from "./translations/procedures";

export type { ModuleUserGroupConfig } from "./types/module";
export type {
  SideNavigationItem,
  SideNavigationItemsProps,
  SideNavigationLinkItem,
  SideNavigationParentItem,
  SideNavigationSubItem,
  SideNavigationSuspenseItem,
} from "./types/sideNavigation";

export {
  getDateFnsLocale,
  formatCalendarWeek,
  formatCalendarWeekRange,
  formatDurationToHoursAndMinutes,
  toLocalDateTime,
  secondToISODuration,
} from "./utils/dateTime";
export {
  createCountFormatter,
  formatBoolean,
  formatDurationFromNowUntil,
  formatSchoolYear,
} from "./utils/formatters";

export {
  ProceduresTableControls,
  type TableControlName,
  reduceActiveTableControl,
} from "./components/tableControls/ProceduresTableControls";

export { RadioSheets, RadioSheetOption } from "./components/RadioSheets";

export {
  validateTodayOrFutureDate,
  validateURL,
  validateNonNegativeInteger,
  validateNumberWithAtMostTwoDecimalDigits,
  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
  validateFieldArray,
  validateMatches,
  validateBatchId,
  validateRequiredBatchId,
  APPOINTMENT_DURATION_MIN_LENGTH,
  APPOINTMENT_DURATION_MAX_LENGTH,
  validateAppointmentDuration,
} from "./helpers/validators";

export { isBusinessModule, isInteger } from "./helpers/guards";

export { CustomAppointmentQuickButtons } from "./components/CustomAppointmentQuickButtons";

export {
  buildOptionFromUser,
  buildOptionsFromProcedureTypes,
  buildOptionsFromUsers,
  mapToSelectOption,
} from "./utils/mappers";
