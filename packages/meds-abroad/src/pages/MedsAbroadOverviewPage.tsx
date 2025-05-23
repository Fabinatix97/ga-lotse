/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { MedsAbroadProceduresTable } from "../components/procedures/proceduresTable/MedsAbroadProceduresTable";

export function MedsAbroadOverviewPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Reisen mit Betäubungsmitteln" />}
    >
      <MainContentLayout fullViewportHeight>
        <MedsAbroadProceduresTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
