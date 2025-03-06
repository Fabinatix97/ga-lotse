/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

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
