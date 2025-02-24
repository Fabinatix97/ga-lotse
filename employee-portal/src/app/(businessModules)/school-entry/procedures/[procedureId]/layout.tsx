/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { PropsWithChildren } from "react";

import { ProcedureToolbar } from "@/lib/businessModules/schoolEntry/features/procedures/ProcedureToolbar";

export type SchoolEntryProcedurePageProps = Readonly<{
  params: SchoolEntryProcedurePageParams;
}>;

export interface SchoolEntryProcedurePageParams {
  procedureId: string;
}

export default function SchoolEntryProcedureLayout(
  props: PropsWithChildren<SchoolEntryProcedurePageProps>,
) {
  return (
    <StickyToolbarLayout
      toolbar={<ProcedureToolbar procedureId={props.params.procedureId} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
