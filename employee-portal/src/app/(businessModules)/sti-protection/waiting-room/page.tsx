/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";

import { WaitingRoomTable } from "@/lib/businessModules/stiProtection/features/waitingRoom/WaitingRoomTable";
import { ToggledPage } from "@/lib/shared/components/ToggledPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function SchoolEntryWaitingRoomPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Wartezimmer" />}>
      <MainContentLayout fullViewportHeight>
        <ToggledPage feature={ApiBaseFeature.StiProtection}>
          <WaitingRoomTable />
        </ToggledPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
