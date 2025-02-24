/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
