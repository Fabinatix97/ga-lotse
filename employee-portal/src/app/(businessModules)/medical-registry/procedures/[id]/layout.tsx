/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { MedicalRegistryProcedurePageParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import { MedicalRegistryTabNavigationToolbar } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryTabNavigationToolbar";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

export default function MedicalRegistryProcedureLayout({
  params,
  children,
}: PropsWithChildren<{ params: MedicalRegistryProcedurePageParams }>) {
  return (
    <StickyToolbarLayout
      toolbar={<MedicalRegistryTabNavigationToolbar procedureId={params.id} />}
    >
      {children}
    </StickyToolbarLayout>
  );
}
