/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { VaccinationConsultationsSearchTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchTable";

export default function VaccinationConsultationsSearchPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Vorgangssuche" />}>
      <MainContentLayout fullViewportHeight>
        <VaccinationConsultationsSearchTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
