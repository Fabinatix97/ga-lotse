/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { ChecklistDefinitionRepoOverviewTable } from "@/lib/businessModules/inspection/components/repository/ChecklistDefinitionRepoOverviewTable";

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
