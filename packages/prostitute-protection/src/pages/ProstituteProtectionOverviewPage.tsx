/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { ProstituteProtectionProceduresTable } from "../components/procedures/proceduresTable/ProstituteProtectionProceduresTable";

export function ProstituteProtectionOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="ProstSchG" />}>
      <MainContentLayout fullViewportHeight>
        <ProstituteProtectionProceduresTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
