/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChecklistDefinitionRepoOverviewTable } from "@/lib/businessModules/inspection/components/repository/ChecklistDefinitionRepoOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function InspectionRepositoryPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Bereitgestellte Checklisten" />}
    >
      <MainContentLayout fullViewportHeight>
        <ChecklistDefinitionRepoOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
