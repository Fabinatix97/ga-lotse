/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiBusinessModule } from "@eshg/base-api";
import { ApiChildSortKey } from "@eshg/dental-api";
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
  useFilterDictionary,
  useGdprValidationTasksAlert,
  useGetGdprValidationBannerQuery,
  usePersonSearch,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDate, useToggleableState } from "@eshg/lib-portal";

import { routes } from "../../../../config/routes";
import { useDentalApi } from "../../../../contexts/dental";
import { Child } from "../../api/models/Child";
import { useGetChildrenQuery } from "../../api/queries/overview";

import {
  ChildrenFilterSettings,
  ChildrenFilters,
} from "./ChildrenFilterSettings";
import {
  CreateChildButton,
  ImportChildrenButton,
  SchoolYearTransitionButton,
} from "./tableButtons";

const initialSorting: ColumnSort = {
  id: "lastName",
  desc: false,
};

export function ChildrenTable() {
  const [activePanel, toggleActivePanel] = useToggleableState<PanelName>();

  const personSearch = usePersonSearch();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  } = useFilterDictionary<keyof ChildrenFilters, ChildrenFilters>({
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

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={[
            <ToggleFilterButton
              {...filterButtonProps}
              key="filterButton"
              isFilterVisible={activePanel === "filters"}
              onClick={() => toggleActivePanel("filters")}
            />,
            <TogglePersonSearchButton
              {...personSearch.buttonProps}
              key="personSearchButton"
              expanded={activePanel === "personSearch"}
              onClick={() => toggleActivePanel("personSearch")}
            />,
          ]}
          right={[
            <CreateChildButton key="createChild" />,
            <ImportChildrenButton key="importChildren" />,
            <SchoolYearTransitionButton key="schoolYearTransition" />,
          ]}
          alignItems="flex-end"
          invertDomOrder
        />
      }
      search={
        activePanel === "personSearch" && (
          <PersonSearchForm
            {...personSearch.formProps}
            allowPartialSearch
            onChange={handleChangePersonSearch}
          />
        )
      }
      filterSettings={
        activePanel === "filters" && (
          <ChildrenFilterSettings
            filterFormValues={filterFormValues}
            setFilterFormValue={setFilterFormValue}
            deleteFilterValue={deleteFilterValue}
            clearFilterValues={clearFilterValues}
            filterSettingsSheetProps={filterSettingsSheetProps}
            activeFilters={activeFilters}
          />
        )
      }
      data-testid="childrenTable"
    >
      <TableSheet
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
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={1200}
          rowNavigation={{
            focusColumnAccessorKey: "lastName",
            route: (row) => routes.children.byId(row.original.id).details,
          }}
        />
      </TableSheet>
    </TablePage>
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
  year: ApiChildSortKey.Year,
};
