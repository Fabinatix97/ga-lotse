/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { VaccinationConsultationsSearchTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function VaccinationConsultationsSearchPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Vorgangssuche" />}>
      <MainContentLayout fullViewportHeight>
        <VaccinationConsultationsSearchTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
