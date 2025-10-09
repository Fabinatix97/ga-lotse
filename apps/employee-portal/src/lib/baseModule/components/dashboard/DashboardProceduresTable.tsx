/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { VisibilityState } from "@tanstack/react-table";

import { DataTable, TableSheet } from "@eshg/lib-employee-portal";

import { useFetchProceduresForDashboardQuery } from "@/lib/baseModule/api/queries/procedures";
import {
  initialSorting,
  proceduresColumns,
} from "@/lib/baseModule/components/procedures/columns";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";

const hiddenProceduresColumns: VisibilityState = {
  createdAt: false,
  businessModule: false,
};

export function DashboardProceduresTable() {
  const procedures = useFetchProceduresForDashboardQuery().data;
  return (
    <TableSheet
      title={
        <Stack padding={1} direction="row" alignItems="center">
          <Typography level="h3" component="h2" id="procedure-table-label">
            Zuletzt bearbeitete Vorgänge
          </Typography>
        </Stack>
      }
      role="region"
      aria-labelledby="procedure-table-label"
    >
      <DataTable
        data={procedures}
        columns={proceduresColumns}
        rowNavigation={{
          route: (row) =>
            resolveProcedureDetailsRoute({
              businessModule: row.original.businessModule,
              procedureId: row.original.procedureId,
              status: row.original.procedureStatus,
            }),
          focusColumnAccessorKey: "procedureType",
        }}
        sorting={{
          manualSorting: false,
          initialSorting,
        }}
        initialColumnVisibility={hiddenProceduresColumns}
      />
    </TableSheet>
  );
}
