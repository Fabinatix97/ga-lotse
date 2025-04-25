/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { Suspense } from "react";

import { ApiUserRole } from "@eshg/base-api";
import { PageGrid, useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";

import { DashboardProceduresTable } from "@/lib/baseModule/components/dashboard/DashboardProceduresTable";
import { DashboardTaskList } from "@/lib/baseModule/components/dashboard/DashboardTaskList";
import { LoadingSheet } from "@/lib/shared/components/LoadingSheet";

export function Dashboard() {
  const showTasks = useHasUserRoleCheck(ApiUserRole.BaseTasksRead);
  const showProcedures = useHasUserRoleCheck(ApiUserRole.BaseProceduresRead);
  if (showProcedures && showTasks) {
    return (
      <PageGrid>
        <Grid lg={7}>
          <Suspense
            fallback={<LoadingSheet title="Vorgänge werden geladen." />}
          >
            <DashboardProceduresTable data-testid="dashboard-procedures-table" />
          </Suspense>
        </Grid>
        <Grid lg={5}>
          <Suspense
            fallback={<LoadingSheet title="Aufgaben werden geladen." />}
          >
            <DashboardTaskList data-testid="dashboard-task-list" />
          </Suspense>
        </Grid>
      </PageGrid>
    );
  }

  if (showProcedures) {
    return <DashboardProceduresTable />;
  }

  if (showTasks) {
    return <DashboardTaskList />;
  }

  return (
    <Alert
      color="primary"
      title="Keine Berechtigungen"
      message="Sie verfügen derzeit nicht über die erforderlichen Berechtigungen, um Vorgänge und Aufgaben aus Fachmodulen abzurufen."
    />
  );
}
