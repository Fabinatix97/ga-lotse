/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { InfectionBriefingProceduresTable } from "../components/procedures/proceduresTable/InfectionBriefingProceduresTable";

export function InfectionBriefingOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Lebensmittelausweis" />}>
      <MainContentLayout fullViewportHeight>
        <InfectionBriefingProceduresTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
