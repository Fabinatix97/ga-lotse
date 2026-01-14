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

import { StiProtectionProceduresTable } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresTable";
import { AddNewProcedureSidebar } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";

export default function STIProtectionProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="HIV-STI" />}>
      <MainContentLayout fullViewportHeight>
        <StiProtectionProceduresTable />
        <AddNewProcedureSidebar />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
