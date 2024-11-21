/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { ProcedureToolbar } from "@/lib/businessModules/schoolEntry/features/procedures/ProcedureToolbar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

export type SchoolEntryProcedurePageProps = Readonly<{
  params: SchoolEntryProcedurePageParams;
}>;

interface SchoolEntryProcedurePageParams {
  id: string;
}

export default function SchoolEntryProcedureLayout(
  props: PropsWithChildren<SchoolEntryProcedurePageProps>,
) {
  return (
    <StickyToolbarLayout
      toolbar={<ProcedureToolbar procedureId={props.params.id} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
