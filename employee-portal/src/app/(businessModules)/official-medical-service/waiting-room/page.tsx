/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WaitingRoomTable } from "@/lib/businessModules/officialMedicalService/components/waitingRoom/WaitingRoomTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function OmsWaitingRoomPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Wartezimmer" />}>
      <MainContentLayout fullViewportHeight>
        <WaitingRoomTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
