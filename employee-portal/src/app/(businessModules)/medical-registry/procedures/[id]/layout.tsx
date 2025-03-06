/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { PropsWithChildren } from "react";

import { MedicalRegistryProcedurePageParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import { MedicalRegistryTabNavigationToolbar } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryTabNavigationToolbar";

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
