/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

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
