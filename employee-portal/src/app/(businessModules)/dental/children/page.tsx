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
import { Cached } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ChildrenTable } from "@/lib/businessModules/dental/features/children/ChildrenTable";
import { CloseSchoolYearButton } from "@/lib/businessModules/dental/features/children/CloseSchoolYearButton";
import { CreateChildSidebar } from "@/lib/businessModules/dental/features/children/new/CreateChildSidebar";
import { useImportChildrenSidebar } from "@/lib/businessModules/dental/import/ImportChildrenSidebar";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";

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

export default function DentalProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ChildrenTable
          buttons={[
            <CloseSchoolYearButton key="closeSchoolYear" />,
            <ImportChildrenButton key="importChildren" />,
            <CreateChildSidebar key="createChild" />,
          ]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
