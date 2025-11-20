/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { ProcedureToolbar } from "../components/procedures/toolbar/ProcedureToolbar";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionProcedureLayout(
  props: DynamicLayoutProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);

  return (
    <StickyToolbarLayout
      toolbar={<ProcedureToolbar procedureId={procedureId} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
