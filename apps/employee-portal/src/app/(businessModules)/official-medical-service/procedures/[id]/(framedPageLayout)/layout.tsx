/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { ProcedureDetailsToolbar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProceduresDetailsToolbar";

export default async function OfficialMedicalServiceDetailsLayout(
  props: DynamicLayoutProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout toolbar={<ProcedureDetailsToolbar id={id} />}>
      <MainContentLayout fullViewportHeight>
        <Box display="contents" role="tabpanel">
          {props.children}
        </Box>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
