/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";

import { VaccinationConsultationsSearchTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchTable";
import { ToggledPage } from "@/lib/businessModules/travelMedicine/shared/ToggledPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function VaccinationConsultationsSearchPage() {
  return (
    <ToggledPage feature={ApiTravelMedicineFeature.ProcedureSearch}>
      <StickyToolbarLayout toolbar={<Toolbar title="Vorgangssuche" />}>
        <MainContentLayout fullViewportHeight>
          <VaccinationConsultationsSearchTable />
        </MainContentLayout>
      </StickyToolbarLayout>
    </ToggledPage>
  );
}
