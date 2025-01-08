/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MedicalRegistryProceduresTable } from "@/lib/businessModules/medicalRegistry/components/procedures/proceduresTable/MedicalRegistryProceduresTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function MedicalRegistryProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Berufskartei" />}>
      <MainContentLayout fullViewportHeight>
        <MedicalRegistryProceduresTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
