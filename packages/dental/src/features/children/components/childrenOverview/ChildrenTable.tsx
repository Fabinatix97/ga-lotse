/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Tooltip, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiBusinessModule } from "@eshg/base-api";
import { ApiBooleanWithUnknown, ApiChildSortKey } from "@eshg/dental-api";
import {
  ButtonBar,
  ChipWithTooltip,
  DataTable,
  Pagination,
  PersonSearchForm,
  PersonSearchFormValues,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  TogglePersonSearchButton,
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
import {
  UnstyledTabList,
  UnstyledTabPanel,
  UnstyledTabs,
  formatDate,
} from "@eshg/lib-portal";

import { routes } from "../../../../config/routes";
import { useDentalApi } from "../../../../contexts/dental";
import { Child } from "../../api/models/Child";
import { useGetChildrenQuery } from "../../api/queries/overview";

import {
  ChildrenFilterSettings,
  ChildrenFilters,
} from "./ChildrenFilterSettings";
import { ChildrenTableTitle } from "./ChildrenTableTitle";
import {
  CreateChildButton,
  ExportChildDataButton,
  ImportChildrenButton,
  SchoolYearTransitionButton,
} from "./tableButtons";

const initialSorting: ColumnSort = {
  id: "lastName",
  desc: false,
};

export function ChildrenTable() {
  const personSearch = usePersonSearch();

  const tableControl = usePersistentTableControl("ZAD_CHILDREN_TABLE_CONTROL", {
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
    defaultPageSize: "50",
  });

  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    setFilterFormValues,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  } = usePersistentFilterDictionary<keyof ChildrenFilters, ChildrenFilters>({
    key: "ZAD_CHILDREN_TABLE_FILTER",
    onChangeFilters: () => {
      tableControl.paginationProps.onPageChange(0);
      personSearch.reset();
    },
  });

  const childrenQuery = useGetChildrenQuery({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
    sortDirection: getSortDirection(tableControl.tableSorting),
    ...filterValues,
    groupNameFilter:
      filterValues.groupFilter?.type === "groupName"
        ? filterValues.groupFilter.groupName
        : undefined,
    noGroupFilter:
      filterValues.groupFilter?.type === "noGroup" ? true : undefined,
    procedureLabelsFilter: filterValues.procedureLabelsFilter?.map(
      (label) => label.id,
    ),
    excludedProcedureLabelsFilter:
      filterValues.excludedProcedureLabelsFilter?.map((label) => label.id),
    ...personSearch.searchParams,
  });

  const { gdprValidationTaskApi } = useDentalApi();
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.Dental,
    gdprValidationTaskApi,
  );

  const [children, gdprBanner] = useSuspenseQueries({
    queries: [childrenQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.Dental,
  });

  function handleChangePersonSearch(formValues: PersonSearchFormValues) {
    tableControl.paginationProps.onPageChange(0);
    clearFilterValues();
    personSearch.setValues(formValues);
  }

  const { rowSelection, rowSelectionProps } = useRowSelection<Child>({
    toggleSelectProps: {
      ariaLabelSelectRow: "Kind auswählen",
      ariaLabelDeselectRow: "Kind abwählen",
      ariaLabelSelectAllRows: "Alle Kinder auswählen",
      ariaLabelDeselectAllRows: "Alle Kinder abwählen",
    },
  });

  useSyncRowSelection(rowSelectionProps, children.data.elements);

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
              right={[
                <CreateChildButton key="createChild" />,
                <ImportChildrenButton key="importChildren" />,
                <ExportChildDataButton key="exportChildData" />,
                <SchoolYearTransitionButton key="schoolYearTransition" />,
              ]}
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
                  onChange={handleChangePersonSearch}
                />
              </UnstyledTabPanel>
            )
          }
          filterSettings={
            currentValue === "filters" && (
              <UnstyledTabPanel<PanelName> value="filters">
                <ChildrenFilterSettings
                  filterFormValues={filterFormValues}
                  setFilterFormValue={setFilterFormValue}
                  setFilterFormValues={setFilterFormValues}
                  deleteFilterValue={deleteFilterValue}
                  clearFilterValues={clearFilterValues}
                  filterSettingsSheetProps={filterSettingsSheetProps}
                  activeFilters={activeFilters}
                />
              </UnstyledTabPanel>
            )
          }
          data-testid="childrenTable"
        >
          <TableSheet
            title={
              <ChildrenTableTitle
                childrenData={children.data.elements}
                rowSelection={rowSelection}
              />
            }
            loading={children.isFetching}
            footer={
              <Pagination
                totalCount={children.data.totalNumberOfElements}
                {...tableControl.paginationProps}
              />
            }
          >
            <DataTable
              data={children.data.elements}
              columns={COLUMNS}
              rowSelectionProps={rowSelectionProps}
              sorting={tableControl.tableSorting}
              enableSortingRemoval={false}
              minWidth={1350}
              rowNavigation={{
                focusColumnAccessorKey: "lastName",
                route: (row) => routes.children.byId(row.original.id).details,
              }}
            />
          </TableSheet>
        </TablePage>
      )}
    </UnstyledTabs>
  );
}

const columnHelper = createColumnHelper<Child>();
const COLUMNS = [
  columnHelper.accessor("firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 180,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("lastName", {
    header: "Nachname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 180,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: true,
    meta: {
      width: 160,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("fluoridationConsent", {
    header: () => (
      <Tooltip title="Fluoridierungseinverständis">
        <Typography>Fluorid. EV</Typography>
      </Tooltip>
    ),
    cell: (props) => formatBooleanWithUnknownShort(props.getValue()),
    enableSorting: true,
    meta: {
      width: 100,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("procedureLabels", {
    header: "Kennungen",
    cell: (props) => (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {props.getValue().map((procedureLabel) => (
          <ChipWithTooltip
            key={procedureLabel.id}
            name={procedureLabel.name}
            hexColor={procedureLabel.hexColor}
            modalTitle="Kennung"
          />
        ))}
      </Stack>
    ),
    enableSorting: false,
    meta: {
      width: 250,
    },
  }),
  columnHelper.accessor("institution", {
    header: "Einrichtung",
    cell: (props) => (
      <Typography sx={{ fontWeight: "bold" }}>
        {props.getValue().name}
      </Typography>
    ),
    enableSorting: false,
    meta: {
      width: 250,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 100,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("year", {
    header: "Jahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

type PanelName = "filters" | "personSearch";

const SORT_KEY_MAPPING: Record<string, ApiChildSortKey> = {
  firstName: ApiChildSortKey.FirstName,
  lastName: ApiChildSortKey.LastName,
  dateOfBirth: ApiChildSortKey.DateOfBirth,
  groupName: ApiChildSortKey.GroupName,
  fluoridationConsent: ApiChildSortKey.FluoridationConsent,
  year: ApiChildSortKey.Year,
};

function formatBooleanWithUnknownShort(value: ApiBooleanWithUnknown) {
  switch (value) {
    case ApiBooleanWithUnknown.True:
      return "Ja";
    case ApiBooleanWithUnknown.False:
      return "Nein";
    case ApiBooleanWithUnknown.Unknown:
      return "-";
  }
}
