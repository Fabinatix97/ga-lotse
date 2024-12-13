/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Cached } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ChildrenTable } from "@/lib/businessModules/dental/features/children/ChildrenTable";
import { CreateChildSidebar } from "@/lib/businessModules/dental/features/children/new/CreateChildSidebar";
import { useImportChildrenSidebar } from "@/lib/businessModules/dental/import/ImportChildrenSidebar";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

function ImportChildrenButton() {
  const importChildrenSidebar = useImportChildrenSidebar();
  return (
    <Button
      size={BUTTON_SIZE}
      onClick={importChildrenSidebar.open}
      variant="outlined"
      startDecorator={<Cached />}
    >
      Daten importieren
    </Button>
  );
}

function CreateChildButton() {
  return (
    <OverlayBoundary>
      <CreateChildSidebar />
    </OverlayBoundary>
  );
}

export default function DentalProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ChildrenTable
          buttons={[
            <ImportChildrenButton key="importChildren" />,
            <CreateChildButton key="createChild" />,
          ]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
