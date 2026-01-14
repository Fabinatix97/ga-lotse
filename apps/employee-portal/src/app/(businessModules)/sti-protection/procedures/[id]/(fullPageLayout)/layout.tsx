/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { ProcedureToolbar } from "@/lib/businessModules/stiProtection/features/procedures/ProcedureToolbar";
import { StiProtectionProcedureRouteParams } from "@/lib/businessModules/stiProtection/features/procedures/StiProtectionProcedureRouteParams";

export default async function StiProtectionProcedureLayout(
  props: DynamicLayoutProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout toolbar={<ProcedureToolbar procedureId={id} />}>
      <Box display="contents" role="tabpanel">
        {props.children}
      </Box>
    </StickyToolbarLayout>
  );
}
