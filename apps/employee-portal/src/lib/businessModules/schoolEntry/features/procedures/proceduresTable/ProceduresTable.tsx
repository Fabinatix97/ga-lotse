/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip, Stack } from "@mui/joy";
import { useQueries } from "@tanstack/react-query";
import {
  ColumnSort,
  TableOptions,
  createColumnHelper,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { isDefined, isNullish } from "remeda";

import {
  ButtonBar,
  ChipWithTooltip,
  DataTable,
  Pagination,
  PersonSearchForm,
  PersonSearchFormValues,
  PersonSearchParams,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  TogglePersonSearchButton,
  UseTableControlResult,
  formatSchoolYear,
  getSortDirection,
  getSortKey,
  useGdprValidationTasksAlert,
  useGetGdprValidationBannerQuery,
  usePersistentFilterDictionary,
  usePersistentTableControl,
  usePersonSearch,
  useRowSelection,
  useSyncRowSelection,
} from "@eshg/lib-employee-portal";
import { formatDate, formatWeekdayDateTime } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import {
  ApiSchoolEntryProcedureSortKey,
  GetProceduresRequest,
} from "@eshg/school-entry-api";

import {
  useGdprValidationTaskApi,
  useSchoolEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { getProceduresQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProceduresTableTitle } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/ProcedureTableTitle";
import {
  PROCEDURE_STATUS,
  PROCEDURE_TYPES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { UnstyledTabList } from "@/lib/shared/components/unstyledTab/UnstyledTabList";
import { UnstyledTabPanel } from "@/lib/shared/components/unstyledTab/UnstyledTabPanel";
import { UnstyledTabs } from "@/lib/shared/components/unstyledTab/UnstyledTabs";

import {
  ProcedureFilterSettings,
  ProcedureFilters,
} from "./ProcedureFilterSettings";

interface ProceduresTableProps {
  buttons?: ReactNode[];
}

const initialSorting: ColumnSort = { id: "child_lastName", desc: false };

export function ProceduresTable(props: ProceduresTableProps) {
  const tableControl = usePersistentTableControl(
    "ESU_PROCEDURE_TABLE_SORTING",
    {
      serverSideSorting: true,
      sortFieldName: "sortKey",
      sortDirectionName: "sortDirection",
      initialSorting,
    },
  );

  const personSearch = usePersonSearch();
  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  } = usePersistentFilterDictionary<keyof ProcedureFilters, ProcedureFilters>({
    key: "ESU_PROCEDURE_TABLE",
    onChangeFilters: () => {
      tableControl.paginationProps.onPageChange(0);
      personSearch.reset();
    },
  });

  function handleChangePersonSearch(formValues: PersonSearchFormValues) {
    tableControl.paginationProps.onPageChange(0);
    clearFilterValues();
    personSearch.setValues(formValues);
  }

  return (
    <UnstyledTabs<PanelName> initialValue={null}>
      {({ currentValue, internalTabListFunction }) => (
        <TablePage
          fullHeight
          controls={
            <ButtonBar
              left={
                <UnstyledTabList<PanelName>
                  tabListItems={[
                    {
                      component: (
                        <ToggleFilterButton
                          {...filterButtonProps}
                          isFilterVisible={currentValue === "filters"}
                        />
                      ),
                      value: "filters",
                    },
                    {
                      component: (
                        <TogglePersonSearchButton
                          {...personSearch.buttonProps}
                          expanded={currentValue === "personSearch"}
                        />
                      ),
                      value: "personSearch",
                    },
                  ]}
                  internalTabListFunction={internalTabListFunction}
                />
              }
              right={props.buttons}
              alignItems="flex-end"
              invertDomOrder
            />
          }
          search={
            currentValue === "personSearch" && (
              <UnstyledTabPanel<PanelName> value="personSearch">
                <PersonSearchForm
                  {...personSearch.formProps}
                  allowPartialSearch
                  allowPersonIdSearch
                  onChange={handleChangePersonSearch}
                />
              </UnstyledTabPanel>
            )
          }
          filterSettings={
            currentValue === "filters" && (
              <UnstyledTabPanel<PanelName> value="filters">
                <ProcedureFilterSettings
                  filterFormValues={filterFormValues}
                  setFilterFormValue={setFilterFormValue}
                  deleteFilterValue={deleteFilterValue}
                  clearFilterValues={clearFilterValues}
                  filterSettingsSheetProps={filterSettingsSheetProps}
                  activeFilters={activeFilters}
                />
              </UnstyledTabPanel>
            )
          }
          data-testid="procedureTable"
        >
          <ProcedureTableSheet
            tableControl={tableControl}
            searchParams={personSearch.searchParams}
            filterValues={filterValues}
          />
        </TablePage>
      )}
    </UnstyledTabs>
  );
}

function ProcedureTableSheet({
  tableControl,
  searchParams,
  filterValues,
}: {
  tableControl: UseTableControlResult;
  searchParams: PersonSearchParams | undefined;
  filterValues: ProcedureFilters;
}) {
  const columns = useProcedureColumns();
  const { rowSelection, rowSelectionProps } = useRowSelection<Procedure>({
    toggleSelectProps: {
      ariaLabelSelectRow: "Vorgang auswählen",
      ariaLabelDeselectRow: "Vorgang abwählen",
      ariaLabelSelectAllRows: "Alle Vorgänge auswählen",
      ariaLabelDeselectAllRows: "Alle Vorgänge abwählen",
    },
  });

  const schoolEntryApi = useSchoolEntryApi();
  const gdprValidationTaskApi = useGdprValidationTaskApi();

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.SchoolEntry,
    gdprValidationTaskApi,
  );
  const paginationParams = mapPaginationQueryParams(tableControl);
  const proceduresQuery = getProceduresQuery(
    schoolEntryApi,
    mapProceduresQueryParams(searchParams, filterValues, paginationParams),
  );
  const [procedures, gdprBanner] = useQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.SchoolEntry,
  });

  useSyncRowSelection(rowSelectionProps, procedures.data?.elements);

  return (
    <TableSheet
      loading={procedures.isFetching}
      title={
        <ProceduresTableTitle
          procedures={procedures.data?.elements ?? []}
          rowSelection={rowSelection}
        />
      }
      footer={
        <Pagination
          loading={procedures.isFetching}
          totalCount={procedures.data?.totalNumberOfElements ?? 0}
          {...tableControl.paginationProps}
        />
      }
    >
      <DataTable
        data={procedures.data?.elements ?? []}
        columns={columns}
        sorting={tableControl.tableSorting}
        enableSortingRemoval={false}
        rowSelectionProps={rowSelectionProps}
        rowNavigation={{
          route: (row) => routes.procedures.byId(row.original.id).details,
          focusColumnAccessorKey: "child.lastName",
        }}
        minWidth={1600}
      />
    </TableSheet>
  );
}

const columnHelper = createColumnHelper<Procedure>();
const COLUMNS = [
  columnHelper.accessor("child.firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: { width: 180, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("child.lastName", {
    header: "Nachname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: { width: 180, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("child.dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: true,
    meta: { width: 155, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("schoolYear", {
    header: "Schuljahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: true,
    meta: { width: 116, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor((row) => row.school?.name, {
    header: "Schule",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: { width: 200, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("type", {
    header: "Art",
    cell: (props) => PROCEDURE_TYPES[props.getValue()],
    enableSorting: true,
    meta: { width: 200, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => (
      <Chip variant="soft">{PROCEDURE_STATUS[props.getValue()]}</Chip>
    ),
    enableSorting: false,
    meta: { width: 100, canNavigate: { parentRow: true } },
  }),
  columnHelper.accessor("labels", {
    header: "Kennungen",
    cell: (props) => (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {props.getValue().map((label) => (
          <ChipWithTooltip
            key={label.id}
            name={label.name}
            hexColor={label.hexColor}
            modalTitle="Kennung"
          />
        ))}
      </Stack>
    ),
    enableSorting: false,
    meta: { width: 250 },
  }),
  columnHelper.accessor("appointmentStart", {
    header: "Termin",
    cell: (props) =>
      isNullish(props.getValue())
        ? ""
        : `${formatWeekdayDateTime(props.getValue())} Uhr`,
    enableSorting: true,
    meta: { canNavigate: { parentRow: true } },
  }),
];

function useProcedureColumns(): TableOptions<Procedure>["columns"] {
  return COLUMNS;
}

type PanelName = "filters" | "personSearch";

const SORT_KEY_MAPPING: Record<string, ApiSchoolEntryProcedureSortKey> = {
  child_firstName: ApiSchoolEntryProcedureSortKey.Firstname,
  child_lastName: ApiSchoolEntryProcedureSortKey.Lastname,
  child_dateOfBirth: ApiSchoolEntryProcedureSortKey.DateOfBirth,
  type: ApiSchoolEntryProcedureSortKey.Type,
  appointmentStart: ApiSchoolEntryProcedureSortKey.AppointmentStart,
  schoolYear: ApiSchoolEntryProcedureSortKey.SchoolYear,
};

type PaginationQueryParams = Pick<
  GetProceduresRequest,
  "pageNumber" | "pageSize" | "sortKey" | "sortDirection"
>;

function mapProceduresQueryParams(
  searchParams: PersonSearchParams | undefined,
  filterValues: ProcedureFilters,
  paginationParams: PaginationQueryParams,
): GetProceduresRequest {
  if (isDefined(searchParams)) {
    return { ...searchParams, ...paginationParams };
  }

  return {
    ...filterValues,
    labelsFilter: filterValues.labelsFilter?.map((label) => label.id),
    ...paginationParams,
  };
}

function mapPaginationQueryParams(
  tableControl: UseTableControlResult,
): PaginationQueryParams {
  return {
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
    sortDirection: getSortDirection(tableControl.tableSorting),
  };
}
