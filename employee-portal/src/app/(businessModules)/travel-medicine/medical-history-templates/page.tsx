/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { MedicalHistoryTemplateOverviewTable } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateOverviewTable";

export default function TemplateOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Anamnesen" />}>
      <MainContentLayout>
        <MedicalHistoryTemplateOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
