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
import { procedureOverviewTableColumns } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/procedureOverviewColumns";
import {
  omsProcedureAssignedFilterNames,
  omsProcedureHighPriorityFilterNames,
  omsProcedureStatusFilterNames,
  omsProcedureTodayFilterNames,
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
import { usePartialPersonSearchHelpers } from "@/lib/shared/components/personSearch/usePartialPersonSearchHelpers";

type PanelName = "filters" | "personSearch";

interface ProceduresOverviewTableProps {
  buttons?: ReactNode[];
  filter: GetAllEmployeeProceduresRequest;
}

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

function createFilterDefinitions(): FilterDefinition[] {
  return [
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
      type: "Enum",
      key: "today",
      name: "Termin heute",
      options: optionsFromRecord(omsProcedureTodayFilterNames),
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

  const {
    hasAtLeastOneValue,
    isInvalidPartialSearch,
    isFullSearch,
    setAlertMessage,
    renderAlert,
  } = usePartialPersonSearchHelpers();

  const personSearch = usePersonSearch();
  const proceduresQuery = useGetAllProceduresQuery({
    ...props.filter,
    ...personSearch.searchParams,
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

  const filterDefinitions = createFilterDefinitions();
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
    },
    showSearch: false,
  });

  function handleChangePersonSearch(formValues: PersonSearchFormValues) {
    if (!hasAtLeastOneValue(formValues)) return;
    if (hasAtLeastOneValue(formValues) && isInvalidPartialSearch(formValues)) {
      setAlertMessage(
        "Die Suche ausschließlich nach Vor- oder Nachname ist nicht erlaubt.",
      );
    } else {
      if (!isFullSearch(formValues)) {
        setAlertMessage(
          "Es werden aus Datenschutzgründen nur offene Vorgänge angezeigt. Geben Sie alle 3 Such-Faktoren an, um auch geschlossene Vorgänge anzuzeigen.",
        );
      } else {
        setAlertMessage(undefined);
      }
      tableControl.paginationProps.onPageChange(0);
      resetFilters();
      personSearch.setValues(formValues);
    }
  }

  function handleReset() {
    setAlertMessage(undefined);
    personSearch.reset();
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
          ]}
          right={props.buttons}
          alignItems="flex-end"
          invertDomOrder={true}
        />
      }
      data-testid="procedures-table"
      search={
        activePanel === "personSearch" && (
          <PersonSearchForm
            {...personSearch.formProps}
            onChange={handleChangePersonSearch}
            onReset={handleReset}
            allowPartialSearch
          >
            {renderAlert()}
          </PersonSearchForm>
        )
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
          columns={procedureOverviewTableColumns()}
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
      case "Date":
      case "EnumSingle":
        filters.set(value.key, value.selectedValue);
        break;
      case "Enum":
        filters.set(value.key, value.selectedValues);
        break;
      case "Number":
        break;
    }
  }

  return Object.fromEntries(filters);
}
