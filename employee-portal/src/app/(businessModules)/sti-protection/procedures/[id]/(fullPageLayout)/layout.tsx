/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { ProcedureToolbar } from "@/lib/businessModules/stiProtection/features/procedures/ProcedureToolbar";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type StiProtectionProcedureRouteParams = {
  id: string;
};

export default async function StiProtectionProcedureLayout(
  props: DynamicLayoutProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout toolbar={<ProcedureToolbar procedureId={id} />}>
      {props.children}
    </StickyToolbarLayout>
  );
}
