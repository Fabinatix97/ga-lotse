/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort } from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";

import {
  ButtonBar,
  DataTable,
  FilterDefinition,
  FilterSettings,
  FilterSettingsSheet,
  FilterSettingsStateProvider,
  FilterValue,
  Pagination,
  PersonSearchForm,
  PersonSearchFormValues,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  TogglePersonSearchButton,
  getSortDirection,
  getSortKey,
  useFilterSettings,
  useGdprValidationTasksAlert,
  useGetGdprValidationBannerQuery,
  useGetSelfUser,
  usePersonSearch,
  useSearchParamStateProvider,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useToggleableState } from "@eshg/lib-portal/hooks/useToggleableState";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import {
  ApiUser,
  GetAllEmployeeProceduresRequest,
} from "@eshg/official-medical-service-api";

import { useGdprValidationTaskApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { useGetAllPhysiciansQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStaffApi";
import { useGetAllProceduresQuery } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import {
  LabCodeSearchForm,
  LabCodeSearchFormValues,
  ToggleLabCodeSearchButton,
  useLabCodeSearch,
} from "@/lib/businessModules/officialMedicalService/components/procedures/overview/LabCodeSearchForm";
import { procedureOverviewTableColumns } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/procedureOverviewColumns";
import {
  omsProcedureStatusFilterNames,
  omsProcedureUrgentFilterNames,
} from "@/lib/businessModules/officialMedicalService/shared/enums";
import { bringToTop } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

type PanelName = "filters" | "personSearch" | "labCodeSearch";

interface ProceduresOverviewTableProps {
  buttons?: ReactNode[];
  filter: GetAllEmployeeProceduresRequest;
}

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

function createFilterDefinitions(
  allPhysicians: ApiUser[],
  selfUser: ApiUser,
): FilterDefinition[] {
  const physicianOptions = allPhysicians.map((apiUser) => ({
    label: apiUser.firstName + " " + apiUser.lastName,
    value: apiUser.userId,
  }));

  const physicianOptionsSelfPrio = bringToTop(
    physicianOptions,
    (p) => p.value === selfUser.userId,
  );

  return [
    {
      type: "Enum",
      key: "assignedPhysicians",
      name: "Zugewiesen",
      options: physicianOptionsSelfPrio,
    },
    {
      type: "Enum",
      key: "status",
      name: "Vorgang Status",
      options: optionsFromRecord(omsProcedureStatusFilterNames),
    },
    {
      type: "Enum",
      key: "urgentCase",
      name: "Dringender Fall",
      options: optionsFromRecord(omsProcedureUrgentFilterNames),
    },
    {
      type: "DateSpan",
      key: "appointmentDateSpan",
      name: "Termin",
      doNotRequireStartAndEnd: true,
      showTodayButton: true,
    },
  ];
}

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

  const gdprValidationTaskApi = useGdprValidationTaskApi();
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.OfficialMedicalService,
    gdprValidationTaskApi,
  );

  const allPhysiciansQuery = useGetAllPhysiciansQuery();

  const [procedures, gdprBanner, allPhysicians] = useSuspenseQueries({
    queries: [proceduresQuery, gdprBannerQuery, allPhysiciansQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.OfficialMedicalService,
  });

  const { data: selfUser } = useGetSelfUser();

  const filterDefinitions = createFilterDefinitions(
    allPhysicians.data,
    selfUser,
  );

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
            <ToggleFilterButton
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
          invertDomOrder
        />
      }
      data-testid="procedures-table"
      search={
        <>
          {activePanel === "personSearch" && (
            <PersonSearchForm
              {...personSearch.formProps}
              allowPartialSearch
              disablePartialSearchAlert
              allowPersonIdSearch
              onChange={handleChangePersonSearch}
              onReset={handleResetPersonSearch}
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
      default:
        break;
    }
  }

  return Object.fromEntries(filters);
}
