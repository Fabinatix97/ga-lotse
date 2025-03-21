/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalRegistryProcedureRouteParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import { MedicalRegistryTabNavigationToolbar } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryTabNavigationToolbar";

export default async function MedicalRegistryProcedureLayout(
  props: DynamicLayoutProps<MedicalRegistryProcedureRouteParams>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout
      toolbar={<MedicalRegistryTabNavigationToolbar procedureId={id} />}
    >
      {props.children}
    </StickyToolbarLayout>
  );
}
