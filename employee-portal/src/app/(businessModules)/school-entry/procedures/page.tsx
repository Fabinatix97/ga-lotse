/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Cached } from "@mui/icons-material";

import { CreateProcedureSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/new/CreateProcedureSidebar";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { ProceduresTable } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/ProceduresTable";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

function ImportDataButton() {
  return (
    <InternalLinkButton
      href={routes.procedures.importData}
      startDecorator={<Cached />}
      variant="outlined"
      size={BUTTON_SIZE}
    >
      Daten importieren
    </InternalLinkButton>
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
