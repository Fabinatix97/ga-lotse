/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { VisibilityState } from "@tanstack/react-table";

import { useFetchProceduresForDashboardQuery } from "@/lib/baseModule/api/queries/procedures";
import {
  initialSorting,
  proceduresColumns,
} from "@/lib/baseModule/components/procedures/columns";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export const hiddenProceduresColumns: VisibilityState = {
  createdAt: false,
  businessModule: false,
};

export function DashboardProceduresTable() {
  const procedures = useFetchProceduresForDashboardQuery().data;
  return (
    <TableSheet
      title={
        <Stack padding={1} direction="row" alignItems="center">
          <Typography level="h3" component="h2">
            Zuletzt bearbeitete Vorgänge
          </Typography>
        </Stack>
      }
    >
      <DataTable
        data={procedures}
        columns={proceduresColumns}
        rowNavRoute={(row) =>
          resolveProcedureDetailsRoute({
            businessModule: row.original.businessModule,
            procedureId: row.original.procedureId,
            status: row.original.procedureStatus,
          })
        }
        sorting={{
          manualSorting: false,
          initialSorting,
        }}
        initialColumnVisibility={hiddenProceduresColumns}
      />
    </TableSheet>
  );
}
