/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  RestrictedPage,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal";

import { FetchTaskForOverviewSearchParamsSchema } from "@/lib/baseModule/api/schemas/tasks";
import { TasksTable } from "@/lib/baseModule/components/task/TasksTable";

export default async function TasksPage(props: PageProps) {
  const searchParams = v.parse(
    FetchTaskForOverviewSearchParamsSchema,
    await props.searchParams,
  );

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Aufgabenübersicht" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.BaseTasksRead}>
          <TasksTable searchParams={searchParams} />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
