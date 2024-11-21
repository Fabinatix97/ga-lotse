/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export type DentalProcedurePageProps = Readonly<{
  params: DentalProcedurePageParams;
}>;

interface DentalProcedurePageParams {
  procedureId: string;
}

export default function DentalProcedureLayout(
  props: PropsWithChildren<DentalProcedurePageProps>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
