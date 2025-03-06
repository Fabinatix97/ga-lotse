/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Child, routes, useGetChildrenQuery } from "@eshg/dental";
import { ApiChildSortKey } from "@eshg/dental-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { useToggleableState } from "@eshg/lib-portal/hooks/useToggleableState";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { ChipWithTooltip } from "@/lib/shared/components/chip/ChipWithTooltip";
import { useFilterDictionary } from "@/lib/shared/components/filterSettings/useFilterDictionary";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import {
  PersonSearchForm,
  PersonSearchFormValues,
  TogglePersonSearchButton,
  usePersonSearch,
} from "@/lib/shared/components/personSearch/PersonSearchForm";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKeyWithSpecificMapping,
} from "@/lib/shared/components/table/sorting";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import {
  ChildrenFilterSettings,
  ChildrenFilters,
} from "./ChildrenFilterSettings";

const initialSorting: ColumnSort = {
  id: "lastName",
  desc: false,
};

interface ChildrenTableProps {
  buttons?: ReactNode[];
}

export function ChildrenTable(props: ChildrenTableProps) {
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
    sortKey: getSortKeyWithSpecificMapping(
      tableControl.tableSorting,
      SORT_KEY_MAPPING,
    ),
    sortDirection: getSortDirection(tableControl.tableSorting),
    ...filterValues,
    ...personSearch.searchParams,
  });

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.Dental,
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
            <FilterButton
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
          right={props.buttons}
          alignItems="flex-end"
          invertDomOrder={true}
        />
      }
      search={
        activePanel === "personSearch" && (
          <PersonSearchForm
            {...personSearch.formProps}
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
      width: 120,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("institution", {
    header: "Einrichtung",
    cell: (props) => (
      <ChipWithTooltip
        key={props.getValue().id}
        name={props.getValue().name}
        hexColor={props.getValue().hexColor}
        modalTitle="Institution"
      />
    ),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 50,
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
      width: 50,
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
