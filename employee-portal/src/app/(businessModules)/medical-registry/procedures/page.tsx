/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { MedicalRegistryProceduresTable } from "@/lib/businessModules/medicalRegistry/components/procedures/proceduresTable/MedicalRegistryProceduresTable";

export default function MedicalRegistryProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Berufskartei" />}>
      <MainContentLayout fullViewportHeight>
        <MedicalRegistryProceduresTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
