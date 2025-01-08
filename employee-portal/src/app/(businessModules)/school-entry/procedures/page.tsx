/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Cached } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useImportDataSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportDataSidebar";
import { CreateProcedureSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/new/CreateProcedureSidebar";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { ProceduresTable } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/ProceduresTable";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

function ImportDataButton() {
  const importDataSidebar = useImportDataSidebar();

  return (
    <Button
      startDecorator={<Cached />}
      variant="outlined"
      size={BUTTON_SIZE}
      onClick={importDataSidebar.open}
    >
      Daten importieren
    </Button>
  );
}

function CreateProcedureButton() {
  return (
    <OverlayBoundary>
      <CreateProcedureSidebar />
    </OverlayBoundary>
  );
}

export default function SchoolEntryProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Einschulungsuntersuchung" />}>
      <MainContentLayout fullViewportHeight>
        <ProceduresTable
          buttons={[
            <ImportDataButton key="importData" />,
            <CreateProcedureButton key="createProcedure" />,
          ]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
