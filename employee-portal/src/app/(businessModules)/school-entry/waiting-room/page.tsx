/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { WaitingRoomTable } from "@/lib/businessModules/schoolEntry/features/waitingRoom/WaitingRoomTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function SchoolEntryWaitingRoomPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Wartezimmer" />}>
      <MainContentLayout fullViewportHeight>
        <WaitingRoomTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
