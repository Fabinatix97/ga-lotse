/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { useToggleableState } from "@eshg/lib-portal/hooks/useToggleableState";
import { ApiSchoolEntryProcedureSortKey } from "@eshg/school-entry-api";
import { Chip, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
  ColumnSort,
  TableOptions,
  createColumnHelper,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { isNullish } from "remeda";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { getProceduresQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProceduresTableTitle } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/ProcedureTableTitle";
import {
  PROCEDURE_STATUS,
  PROCEDURE_TYPES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
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
  useRowSelection,
  useSyncRowSelection,
} from "@/lib/shared/hooks/table/useRowSelection";

import {
  ProcedureFilterSettings,
  ProcedureFilters,
} from "./ProcedureFilterSettings";

interface ProceduresTableProps {
  buttons?: ReactNode[];
}

const initialSorting: ColumnSort = {
  id: "child_dateOfBirth",
  desc: true,
};

export function ProceduresTable(props: ProceduresTableProps) {
  const [activePanel, toggleActivePanel] = useToggleableState<PanelName>();
  const columns = useProcedureColumns();
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });
  const { rowSelection, rowSelectionProps } = useRowSelection<Procedure>();
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
  } = useFilterDictionary<keyof ProcedureFilters, ProcedureFilters>({
    onChangeFilters: () => {
      tableControl.paginationProps.onPageChange(0);
      personSearch.reset();
    },
  });

  const schoolEntryApi = useSchoolEntryApi();
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.SchoolEntry,
  );
  const proceduresQuery = getProceduresQuery(schoolEntryApi, {
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    ...filterValues,
    labelsFilter: filterValues.labelsFilter?.map((label) => label.id),
    ...personSearch.searchParams,
    sortKey: getSortKeyWithSpecificMapping(
      tableControl.tableSorting,
      SORT_KEY_MAPPING,
    ),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const [procedures, gdprBanner] = useSuspenseQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.SchoolEntry,
  });

  useSyncRowSelection(rowSelectionProps, procedures.data.elements);

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
          <ProcedureFilterSettings
            filterFormValues={filterFormValues}
            setFilterFormValue={setFilterFormValue}
            deleteFilterValue={deleteFilterValue}
            clearFilterValues={clearFilterValues}
            filterSettingsSheetProps={filterSettingsSheetProps}
            activeFilters={activeFilters}
          />
        )
      }
      data-testid="procedureTable"
    >
      <TableSheet
        loading={procedures.isFetching}
        title={
          <ProceduresTableTitle
            procedures={procedures.data.elements}
            rowSelection={rowSelection}
          />
        }
        footer={
          <Pagination
            totalCount={procedures.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={procedures.data.elements}
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
    </TablePage>
  );
}

const columnHelper = createColumnHelper<Procedure>();
const COLUMNS = [
  columnHelper.accessor("child.firstName", {
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
  columnHelper.accessor("child.lastName", {
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
  columnHelper.accessor("child.dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: true,
    meta: {
      width: 155,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("schoolYear", {
    header: "Schuljahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: true,
    meta: {
      width: 116,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("school.name", {
    header: "Schule",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 200,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("type", {
    header: "Art",
    cell: (props) => PROCEDURE_TYPES[props.getValue()],
    enableSorting: true,
    meta: {
      width: 200,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => (
      <Chip variant="soft">{PROCEDURE_STATUS[props.getValue()]}</Chip>
    ),
    enableSorting: false,
    meta: {
      width: 100,
      canNavigate: {
        parentRow: true,
      },
    },
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
    meta: {
      width: 250,
    },
  }),
  columnHelper.accessor("appointmentStart", {
    header: "Termin",
    cell: (props) =>
      isNullish(props.getValue())
        ? ""
        : `${formatDateTime(props.getValue())} Uhr`,
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
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
