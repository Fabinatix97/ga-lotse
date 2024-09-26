/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule, ApiUserRole } from "@eshg/employee-portal-api/base";

import { Teamview } from "@/lib/baseModule/components/task/Teamview";
import { useFetchTasksForTeamViewOptions } from "@/lib/businessModules/inspection/api/queries/useFetchTasksForTeamViewOptions";
import { moduleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function InspectionTeamviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Teamansicht" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.InspectionLeader}>
          <Teamview
            groupName={moduleUserGroup.group}
            businessModule={ApiBusinessModule.Inspection}
            useFetchTasksForTeamViewOptions={useFetchTasksForTeamViewOptions}
          />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
