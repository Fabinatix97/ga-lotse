/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { WaitingRoomTable } from "@/lib/businessModules/stiProtection/features/waitingRoom/WaitingRoomTable";

export default function STIProtectionWaitingRoomPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Wartezimmer" />}>
      <MainContentLayout fullViewportHeight>
        <WaitingRoomTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
