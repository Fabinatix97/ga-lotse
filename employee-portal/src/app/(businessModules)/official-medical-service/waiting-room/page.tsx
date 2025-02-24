/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { WaitingRoomTable } from "@/lib/businessModules/officialMedicalService/components/waitingRoom/WaitingRoomTable";

export default function OmsWaitingRoomPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Wartezimmer" />}>
      <MainContentLayout fullViewportHeight>
        <WaitingRoomTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
