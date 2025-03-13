/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { ProcedureDetailsToolbar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProceduresDetailsToolbar";

export default function OfficialMedicalServiceDetailsLayout(
  props: DynamicLayoutProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = props.params;

  return (
    <StickyToolbarLayout toolbar={<ProcedureDetailsToolbar id={id} />}>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
