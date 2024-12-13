/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import {
  ApiApplicantAddress,
  ApiMedicalRegistryEntry,
} from "@eshg/employee-portal-api/medicalRegistry";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import { useGetMedicalRegistryProcedureOverviewQuery } from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { MedicalRegistryProcedureChip } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryProcedureChip";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { translateCountry } from "@/lib/shared/helpers/i18n";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import { MedicalRegistryProceduresSearchBar } from "./MedicalRegistryProceduresSearchBar";

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
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
      meta: {
        width: 180,
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
        width: 270,
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
  ];
}

export function MedicalRegistryProceduresTable() {
  const tableControl = useTableControl();

  const proceduresQuery = useGetMedicalRegistryProcedureOverviewQuery(
    tableControl.paginationProps,
  );
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
      controls={<MedicalRegistryProceduresSearchBar />}
    >
      {" "}
      <TableSheet
        loading={isLoading}
        footer={
          <Pagination
            totalCount={totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={medicalRegistryEntries}
          columns={getProceduresColumns()}
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "id",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
