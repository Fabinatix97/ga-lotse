/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";
import * as v from "valibot";

import { ProcedureToolbar } from "@/lib/businessModules/schoolEntry/features/procedures/ProcedureToolbar";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";

export default function SchoolEntryProcedureLayout(props: DynamicLayoutProps) {
  const { procedureId } = v.parse(
    SchoolEntryProcedureRouteParamsSchema,
    props.params,
  );

  return (
    <StickyToolbarLayout
      toolbar={<ProcedureToolbar procedureId={procedureId} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
