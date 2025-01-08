/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MedicalHistoryTemplateOverviewTable } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function TemplateOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Anamnesen" />}>
      <MainContentLayout>
        <MedicalHistoryTemplateOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
