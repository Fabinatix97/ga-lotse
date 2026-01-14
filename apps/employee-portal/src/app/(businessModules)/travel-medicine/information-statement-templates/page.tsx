/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { InformationStatementTemplateOverviewTable } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateOverviewTable";

export default function InformationStatementTemplateOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Aufklärungsbögen" />}>
      <MainContentLayout>
        <InformationStatementTemplateOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
