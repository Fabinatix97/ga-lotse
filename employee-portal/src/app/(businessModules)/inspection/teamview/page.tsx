/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { Teamview } from "@/lib/baseModule/components/task/Teamview";
import { moduleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function InspectionTeamviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Teamansicht" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.InspectionLeader}>
          <Teamview
            groupName={moduleUserGroup.group}
            businessModule={ApiBusinessModule.Inspection}
          />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
