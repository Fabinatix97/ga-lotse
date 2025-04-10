/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useToggleableState } from "@eshg/lib-portal/hooks/useToggleableState";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { GetAllEmployeeProceduresRequest } from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort } from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";

import { useGetAllProceduresQuery } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import {
  LabCodeSearchForm,
  LabCodeSearchFormValues,
  ToggleLabCodeSearchButton,
  useLabCodeSearch,
} from "@/lib/businessModules/officialMedicalService/components/procedures/overview/LabCodeSearchForm";
import { procedureOverviewTableColumns } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/procedureOverviewColumns";
import {
  omsProcedureAssignedFilterNames,
  omsProcedureHighPriorityFilterNames,
  omsProcedureStatusFilterNames,
} from "@/lib/businessModules/officialMedicalService/shared/enums";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  FilterSettingsStateProvider,
  useFilterSettings,
} from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useSearchParamStateProvider } from "@/lib/shared/components/filterSettings/useSearchParamStateProvider";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import {
  PersonSearchForm,
  PersonSearchFormValues,
  TogglePersonSearchButton,
  usePersonSearch,
} from "@/lib/shared/components/personSearch/PersonSearchForm";

type PanelName = "filters" | "personSearch" | "labCodeSearch";

interface ProceduresOverviewTableProps {
  buttons?: ReactNode[];
  filter: GetAllEmployeeProceduresRequest;
}

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

const filterDefinitions = [
  {
    type: "Enum",
    key: "assigned",
    name: "Zugewiesen",
    options: optionsFromRecord(omsProcedureAssignedFilterNames),
  },
  {
    type: "Enum",
    key: "status",
    name: "Vorgang Status",
    options: optionsFromRecord(omsProcedureStatusFilterNames),
  },
  {
    type: "Enum",
    key: "highPriority",
    name: "Dringender Fall",
    options: optionsFromRecord(omsProcedureHighPriorityFilterNames),
  },
  {
    type: "DateSpan",
    key: "appointmentDateSpan",
    name: "Termin",
    doNotRequireStartAndEnd: true,
    showTodayButton: true,
  },
] as const satisfies FilterDefinition[];

export function ProceduresOverviewTable(
  props: Readonly<ProceduresOverviewTableProps>,
) {
  const [activePanel, toggleActivePanel] = useToggleableState<PanelName>();
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const personSearch = usePersonSearch();
  const labCodeSearch = useLabCodeSearch();
  const proceduresQuery = useGetAllProceduresQuery({
    ...props.filter,
    ...personSearch.searchParams,
    ...labCodeSearch.searchParams,
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.OfficialMedicalService,
  );

  const [procedures, gdprBanner] = useSuspenseQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.OfficialMedicalService,
  });

  const paramStateProvider = useSearchParamStateProvider(
    filterDefinitions,
    true,
  );

  const { stateProvider, resetFilters } = useOmsProceduresFilterState({
    stateProvider: paramStateProvider,
    defaults: [],
    filter: props.filter,
  });

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    stateProvider,
    onValuesSubmit: (_values) => {
      personSearch.reset();
      labCodeSearch.reset();
    },
    showSearch: false,
  });

  function handleChangePersonSearch(formValues: PersonSearchFormValues) {
    tableControl.paginationProps.onPageChange(0);
    resetFilters();
    labCodeSearch.reset();
    personSearch.setValues(formValues);
  }

  function handleChangeLabCodeSearch(formValues: LabCodeSearchFormValues) {
    if (!formValues.labCode) return;
    tableControl.paginationProps.onPageChange(0);
    resetFilters();
    personSearch.reset();
    labCodeSearch.setValues(formValues);
  }

  function handleResetPersonSearch() {
    personSearch.reset();
  }

  function handleResetLabCodeSearch() {
    labCodeSearch.reset();
  }

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={[
            <FilterButton
              {...filterSettings.filterButtonProps}
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
            <ToggleLabCodeSearchButton
              {...labCodeSearch.buttonProps}
              key="labCodeSearchButton"
              expanded={activePanel === "labCodeSearch"}
              onClick={() => toggleActivePanel("labCodeSearch")}
            />,
          ]}
          right={props.buttons}
          alignItems="flex-end"
          invertDomOrder={true}
        />
      }
      data-testid="procedures-table"
      search={
        <>
          {activePanel === "personSearch" && (
            <PersonSearchForm
              {...personSearch.formProps}
              onChange={handleChangePersonSearch}
              onReset={handleResetPersonSearch}
              allowPartialSearch
            />
          )}
          {activePanel === "labCodeSearch" && (
            <LabCodeSearchForm
              {...labCodeSearch.formProps}
              onChange={handleChangeLabCodeSearch}
              onReset={handleResetLabCodeSearch}
            />
          )}
        </>
      }
      filterSettings={
        activePanel === "filters" && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings {...filterSettings.filterSettingsProps} />
          </FilterSettingsSheet>
        )
      }
    >
      <TableSheet
        loading={procedures.isFetching}
        footer={
          <Pagination
            totalCount={procedures.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={procedures.data.elements}
          columns={procedureOverviewTableColumns(
            procedures.data.medicalOpinionLeadTime,
          )}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) => routes.procedures.byId(row.original.id).details,
            focusColumnAccessorKey: "lastName",
          }}
          minWidth={780}
        />
      </TableSheet>
    </TablePage>
  );
}

function useOmsProceduresFilterState(options: {
  stateProvider: FilterSettingsStateProvider;
  filter: GetAllEmployeeProceduresRequest;
  defaults: FilterValue[];
}) {
  const { activeValues, setActiveValues, ...rest } = options.stateProvider;
  const [touched, setTouched] = useState(activeValues.length > 0);

  const stateProvider: FilterSettingsStateProvider = {
    activeValues: touched ? activeValues : options.defaults,
    setActiveValues: (values) => {
      setTouched(true);
      setActiveValues(values);
    },
    ...rest,
  };

  const filter: GetAllEmployeeProceduresRequest = useMemo(
    () => ({
      ...options.filter,
      ...(touched ? {} : activeValuesToFilters(options.defaults)),
    }),
    [options.filter, options.defaults, touched],
  );

  function resetFilters() {
    setTouched(false);
    setActiveValues(options.defaults);
  }

  return {
    stateProvider,
    filter,
    resetFilters,
  };
}

function activeValuesToFilters(
  activeValues: FilterValue[],
): GetAllEmployeeProceduresRequest {
  const filters = new Map<string, unknown>();

  for (const value of activeValues) {
    switch (value.type) {
      case "DateSpan":
        filters.set(value.key + "Start", value.startDate);
        filters.set(value.key + "End", value.endDate);
        break;
      case "EnumSingle":
        filters.set(value.key, value.selectedValue);
        break;
      case "Enum":
        filters.set(value.key, value.selectedValues);
        break;
    }
  }

  return Object.fromEntries(filters);
}
