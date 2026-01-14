/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  RestrictedPage,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { Teamview } from "@/lib/businessModules/inspection/components/teamview/Teamview";
import { moduleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";

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
