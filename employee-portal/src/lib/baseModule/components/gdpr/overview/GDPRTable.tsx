/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiUserRole,
  GetGdprProceduresRequest,
} from "@eshg/employee-portal-api/base";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";

import { useGetGdprProcedureOverviewQuery } from "@/lib/baseModule/api/queries/gdpr";
import { TYPE_OPTIONS } from "@/lib/baseModule/components/gdpr/i18n";
import { useCreateGDPRProcedureSidebar } from "@/lib/baseModule/components/gdpr/overview/CreateGDPRProcedureSidebar";
import { columns } from "@/lib/baseModule/components/gdpr/overview/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function GDPRTable({ params }: { params: GetGdprProceduresRequest }) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseGdprProcedureWrite);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });
  const {
    data: { elements, totalNumberOfElements },
    isFetching,
  } = useGetGdprProcedureOverviewQuery(params);
  const sidebar = useCreateGDPRProcedureSidebar();

  return (
    <TablePage
      data-testid="gdpr-procedures-table"
      controls={
        <ButtonBar
          left={
            <SingleSelectFilter
              tableControl={tableControl}
              placeholder={"Typ"}
              searchParamName={"type"}
              options={TYPE_OPTIONS}
            />
          }
          right={
            hasWritePerms && (
              <Button
                onClick={() => sidebar.open()}
                startDecorator={<AddIcon />}
              >
                Vorgang anlegen
              </Button>
            )
          }
        />
      }
    >
      <TableSheet
        loading={isFetching}
        footer={
          <Pagination
            totalCount={totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={elements}
          columns={columns}
          sorting={tableControl.tableSorting}
        />
      </TableSheet>
    </TablePage>
  );
}
