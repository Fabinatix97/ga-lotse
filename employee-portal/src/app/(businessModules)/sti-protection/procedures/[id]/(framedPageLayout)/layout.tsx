/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

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
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
