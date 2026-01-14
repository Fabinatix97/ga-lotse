/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useFilterDictionary,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal";

import { useGetSearchVaccinationConsultationQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import {
  ProcedureFilters,
  VaccinationConsultationsSearchFilterSettings,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchFilterSettings";
import { searchColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/searchColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useToggle } from "@/lib/shared/hooks/useToggle";

export function VaccinationConsultationsSearchTable() {
  const [filterVisible, toggleFilterVisible] = useToggle(true);
  const tableControl = useTableControl({ serverSideSorting: true });
  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterSettingsSheetProps,
    activeFilters,
  } = useFilterDictionary<keyof ProcedureFilters, ProcedureFilters>({});

  const [{ data: searchResults, isFetching }] = useSuspenseQueries({
    queries: [
      useGetSearchVaccinationConsultationQuery(
        filterValues.lastName,
        filterValues.firstName,
        filterValues.dateOfBirth,
        filterValues.status,
      ),
    ],
  });

  function filterValuesNotEmpty() {
    if (
      (filterValues.lastName === undefined || filterValues.lastName === "") &&
      (filterValues.firstName === undefined || filterValues.firstName === "") &&
      filterValues.dateOfBirth === undefined &&
      filterValues.status === undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={
            <ToggleFilterButton
              isFilterVisible={filterVisible}
              activeFilters={activeFilters.length}
              onClick={toggleFilterVisible}
            />
          }
        />
      }
      filterSettings={
        filterVisible && (
          <VaccinationConsultationsSearchFilterSettings
            filterFormValues={filterFormValues}
            setFilterFormValue={setFilterFormValue}
            deleteFilterValue={deleteFilterValue}
            clearFilterValues={clearFilterValues}
            filterSettingsSheetProps={filterSettingsSheetProps}
            activeFilters={activeFilters}
          />
        )
      }
    >
      <TableSheet
        loading={isFetching}
        title={
          <Alert
            title="Es werden maximal 50 Suchergebnisse angezeigt."
            color="primary"
          />
        }
      >
        <DataTable
          data={
            filterValuesNotEmpty() ? searchResults.vaccinationConsultations : []
          }
          columns={searchColumns()}
          sorting={tableControl.tableSorting}
          rowNavigation={{
            route: (row) =>
              routes.procedures.baseData(row.original.procedureId),
            focusColumnAccessorKey: "lastName",
          }}
          minWidth={1050}
        />
      </TableSheet>
    </TablePage>
  );
}
