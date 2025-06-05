/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useReducer, useState } from "react";
import { isDefined } from "remeda";

import {
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  NoSearchResults,
  Pagination,
  TablePage,
  TableSheet,
  useGdprValidationTasksAlert,
  usePagination,
} from "@eshg/lib-employee-portal";
import { formatDate, translateCountry } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { PROFESSIONAL_TITLE_NAMES } from "@eshg/medical-registry";
import {
  ApiApplicantAddress,
  ApiMedicalRegistryEntry,
} from "@eshg/medical-registry-api";

import { useGetMedicalProceduresTablePage } from "@/lib/businessModules/medicalRegistry/api/queries/useGetMedicalProceduresTablePage";
import { MedicalRegistryProcedureChip } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryProcedureChip";
import { useMedicalRegistryFilterSettings } from "@/lib/businessModules/medicalRegistry/shared/hooks/useMedicalRegistryFilterSettings";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

import { MedicalRegistryEntryOverviewControls } from "./MedicalRegistryEntryOverviewControls";

const columnHelper = createColumnHelper<ApiMedicalRegistryEntry>();

function formatAddress(address: ApiApplicantAddress) {
  return `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}, ${translateCountry(address.country)}`;
}

function getProceduresColumns() {
  return [
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
    columnHelper.accessor("professionalTitle", {
      header: "Berufsbezeichnung",
      cell: (props) => {
        const title = props.getValue();
        return isDefined(title) && PROFESSIONAL_TITLE_NAMES[title];
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

type PanelName = "filters" | "entrySearch";

function reduceActivePanel(
  state: PanelName | undefined,
  newState: PanelName,
): PanelName | undefined {
  return newState === state ? undefined : newState;
}

export function MedicalRegistryProceduresTable() {
  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const filterSettings = useMedicalRegistryFilterSettings();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePanel, toggleActivePanel] = useReducer(
    reduceActivePanel,
    undefined,
  );

  useEffect(() => {
    resetPageNumber();
  }, [activePanel, searchQuery, filterSettings.activeValues, resetPageNumber]);

  const { medicalHistoryData, isLoading, gdprBanner } =
    useGetMedicalProceduresTablePage(
      activePanel === "entrySearch",
      pageSize,
      page,
      filterSettings.activeValues,
      searchQuery,
    );

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.MedicalRegistry,
  });

  return (
    <TablePage
      aria-label="Vorgänge"
      fullHeight
      controls={
        <MedicalRegistryEntryOverviewControls
          filterSettings={filterSettings}
          activePanel={activePanel}
          toggleActivePanel={toggleActivePanel}
          onNameSearch={setSearchQuery}
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
          activePanel !== "entrySearch" &&
          medicalHistoryData && (
            <Pagination
              {...getPaginationProps({
                totalCount: medicalHistoryData.totalElements,
              })}
            />
          )
        }
      >
        <DataTable
          data={medicalHistoryData?.medicalRegistryEntries ?? []}
          columns={getProceduresColumns()}
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "lastName",
          }}
          noDataComponent={
            isLoading
              ? undefined
              : () => (
                  <Box flex={1} alignContent="center">
                    <NoSearchResults info="Keine Vorgänge vorhanden" />
                  </Box>
                )
          }
        />
      </TableSheet>
    </TablePage>
  );
}
