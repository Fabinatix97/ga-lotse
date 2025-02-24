/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { Stack } from "@mui/joy";

import { StiProtectionProceduresSearchBar } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresSearchBar";
import { StiProtectionProceduresTable } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresTable";
import { AddNewProcedureSidebar } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";

export default function STIProtectionProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="HIV-STI" />}>
      <MainContentLayout fullViewportHeight>
        <Stack gap={3}>
          <StiProtectionProceduresSearchBar />
          <StiProtectionProceduresTable />
        </Stack>
        <AddNewProcedureSidebar />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
