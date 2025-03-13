/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal/types/pageParams";
import * as v from "valibot";

import { FetchTaskForOverviewSearchParamsSchema } from "@/lib/baseModule/api/schemas/tasks";
import { TasksTable } from "@/lib/baseModule/components/task/TasksTable";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function TasksPage(props: PageProps) {
  const searchParams = v.parse(
    FetchTaskForOverviewSearchParamsSchema,
    props.searchParams,
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
