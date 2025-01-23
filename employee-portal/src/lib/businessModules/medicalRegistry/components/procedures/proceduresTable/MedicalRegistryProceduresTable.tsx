/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import {
  ApiApplicantAddress,
  ApiMedicalRegistryEntry,
} from "@eshg/employee-portal-api/medicalRegistry";
import { professionalTitleNames } from "@eshg/lib-portal/businessModules/medicalRegistry/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useReducer } from "react";
import { isDefined } from "remeda";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  getMedicalRegistryOverviewQuery,
  getMedicalRegistrySearchQuery,
} from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { MedicalRegistryProcedureChip } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryProcedureChip";
import {
  getMedicalRegistryEntryFilters,
  useMedicalRegistryFilterSettings,
} from "@/lib/businessModules/medicalRegistry/shared/hooks/useMedicalRegistryFilterSettings";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import { MedicalRegistryEntryOverviewControls } from "./MedicalRegistryEntryOverviewControls";

const columnHelper = createColumnHelper<ApiMedicalRegistryEntry>();

function formatAddress(address: ApiApplicantAddress) {
  return `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}, ${translateCountry(address.country)}`;
}

function getProceduresColumns() {
  return [
    columnHelper.accessor("lastName", {
      header: "Name",
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("professionalTitle", {
      header: "Berufsbezeichnung",
      cell: (props) => {
        const title = props.getValue();
        return isDefined(title) && professionalTitleNames[title];
      },
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
      meta: {
        width: 150,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("address", {
      header: "Adresse",
      cell: ({ getValue }) => formatAddress(getValue()),
      enableSorting: false,
      meta: {
        width: 350,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("certificateRequested", {
      header: "Bescheinigung abgefragt",
      cell: ({ getValue }) => (getValue() ? "Ja" : "Nein"),
      enableSorting: false,
      meta: {
        width: 210,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Status",
      cell: ({ row }) => {
        const procedure = row.original;
        return (
          <MedicalRegistryProcedureChip
            status={procedure.status}
            type={procedure.type}
          />
        );
      },
      enableSorting: false,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellungsdatum",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}

export function MedicalRegistryProceduresTable() {
  const tableControl = useTableControl();
  const filterSettings = useMedicalRegistryFilterSettings();

  const [activePanel, toggleActivePanel] = useReducer(
    reduceActivePanel,
    undefined,
  );

  type PanelName = "filters" | "entrySearch";

  function reduceActivePanel(
    state: PanelName | undefined,
    newState: PanelName,
  ): PanelName | undefined {
    return newState === state ? undefined : newState;
  }

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("name") ?? "";

  const medicalRegistryApi = useMedicalRegistryApi();

  const proceduresQuery =
    activePanel === "entrySearch"
      ? getMedicalRegistrySearchQuery(medicalRegistryApi, searchQuery)
      : getMedicalRegistryOverviewQuery(medicalRegistryApi, {
          ...getMedicalRegistryEntryFilters(filterSettings.activeValues),
          pageSize: tableControl.paginationProps.pageSize,
          pageNumber: tableControl.paginationProps.pageNumber,
        });

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.MedicalRegistry,
  );

  const [
    {
      data: { medicalRegistryEntries, totalElements },
      isLoading,
    },
    gdprBanner,
  ] = useSuspenseQueries({ queries: [proceduresQuery, gdprBannerQuery] });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.MedicalRegistry,
  });

  return (
    <TablePage
      aria-label="Vorgänge"
      controls={
        <MedicalRegistryEntryOverviewControls
          filterSettings={filterSettings}
          activePanel={activePanel}
          toggleActivePanel={toggleActivePanel}
        />
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
        loading={isLoading}
        footer={
          activePanel !== "entrySearch" && (
            <Pagination
              totalCount={totalElements}
              {...tableControl.paginationProps}
            />
          )
        }
      >
        <DataTable
          data={medicalRegistryEntries}
          columns={getProceduresColumns()}
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "lastName",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
