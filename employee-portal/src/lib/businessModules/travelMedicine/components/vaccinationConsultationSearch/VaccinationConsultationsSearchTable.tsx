/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetSearchVaccinationConsultationQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import {
  ProcedureFilters,
  VaccinationConsultationsSearchFilterSettings,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchFilterSettings";
import { searchColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/searchColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useFilterDictionary } from "@/lib/shared/components/filterSettings/useFilterDictionary";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
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
            <FilterButton
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
        />
      </TableSheet>
    </TablePage>
  );
}
