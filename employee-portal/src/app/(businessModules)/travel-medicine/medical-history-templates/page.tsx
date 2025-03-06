/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

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
