/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CreateProcedure } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/CreateProcedure";
import { ProceduresOverviewTable } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/ProceduresOverviewTable";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

function CreateProcedureButton() {
  return (
    <OverlayBoundary>
      <CreateProcedure />
    </OverlayBoundary>
  );
}

export default function OfficialMedicalServiceProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Amtsärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ProceduresOverviewTable
          buttons={[<CreateProcedureButton key="createProcedure" />]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
