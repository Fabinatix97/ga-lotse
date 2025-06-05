/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { ProcedureToolbar } from "@/lib/businessModules/schoolEntry/features/procedures/ProcedureToolbar";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";

export default async function SchoolEntryProcedureLayout(
  props: DynamicLayoutProps,
) {
  const params = await props.params;
  const { procedureId } = v.parse(
    SchoolEntryProcedureRouteParamsSchema,
    params,
  );

  return (
    <StickyToolbarLayout
      toolbar={<ProcedureToolbar procedureId={procedureId} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
