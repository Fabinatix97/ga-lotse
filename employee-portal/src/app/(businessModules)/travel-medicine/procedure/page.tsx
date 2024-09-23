/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { VaccinationConsultationsOverviewTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationsOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function VaccinationConsultationsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Impfberatung" />}>
      <MainContentLayout>
        <VaccinationConsultationsOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
