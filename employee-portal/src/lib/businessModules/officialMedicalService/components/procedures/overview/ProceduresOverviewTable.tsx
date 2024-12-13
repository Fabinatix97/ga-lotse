/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useGetAllProceduresQuery } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { procedureOverviewTableColumns } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/procedureOverviewColumns";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

interface ProceduresOverviewTableProps {
  buttons?: ReactNode[];
}

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

export function ProceduresOverviewTable(
  props: Readonly<ProceduresOverviewTableProps>,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const proceduresQuery = useGetAllProceduresQuery({
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

  return (
    <TablePage
      fullHeight
      controls={<ButtonBar right={props.buttons} alignItems="flex-end" />}
      data-testid="procedures-table"
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
          minWidth={450}
        />
      </TableSheet>
    </TablePage>
  );
}
