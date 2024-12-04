/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";

import { StiProtectionProceduresSearchBar } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresSearchBar";
import { StiProtectionProceduresTable } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresTable";
import { AddNewProcedureSidebar } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
