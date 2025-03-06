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
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { TasksTable } from "@/lib/baseModule/components/task/TasksTable";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function TasksPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Aufgabenübersicht" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.BaseTasksRead}>
          <TasksTable searchParams={props.searchParams} />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
