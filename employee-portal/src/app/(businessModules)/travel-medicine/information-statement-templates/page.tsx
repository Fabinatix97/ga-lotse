/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";

import { InformationStatementTemplateOverviewTable } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateOverviewTable";
import { ToggledPage } from "@/lib/businessModules/travelMedicine/shared/ToggledPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function InformationStatementTemplateOverviewPage() {
  return (
    <ToggledPage
      feature={ApiTravelMedicineFeature.CitizenPortalInformationStatement}
    >
      <StickyToolbarLayout toolbar={<Toolbar title="Aufklärungsbögen" />}>
        <MainContentLayout>
          <InformationStatementTemplateOverviewTable />
        </MainContentLayout>
      </StickyToolbarLayout>
    </ToggledPage>
  );
}
