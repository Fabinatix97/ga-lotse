/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useCreateChildSidebar, useImportChildrenSidebar } from "@eshg/dental";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { Add, Cached } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ChildrenTable } from "@/lib/businessModules/dental/features/children/ChildrenTable";
import { CloseSchoolYearButton } from "@/lib/businessModules/dental/features/children/CloseSchoolYearButton";

function ImportChildrenButton() {
  const importChildrenSidebar = useImportChildrenSidebar();
  return (
    <Button
      size="sm"
      variant="outlined"
      startDecorator={<Cached />}
      onClick={importChildrenSidebar.open}
    >
      Daten importieren
    </Button>
  );
}

function CreateChildButton() {
  const createChildSidebar = useCreateChildSidebar();

  return (
    <Button
      size="sm"
      startDecorator={<Add />}
      onClick={createChildSidebar.open}
    >
      Neues Kind anlegen
    </Button>
  );
}

export default function DentalProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ChildrenTable
          buttons={[
            <CloseSchoolYearButton key="closeSchoolYear" />,
            <ImportChildrenButton key="importChildren" />,
            <CreateChildButton key="createChild" />,
          ]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
