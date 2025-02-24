/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { PropsWithChildren } from "react";

import { ChildToolbar } from "@/lib/businessModules/dental/features/children/details/ChildToolbar";

export type DentalChildPageProps = Readonly<{
  params: DentalChildPageParams;
}>;

export interface DentalChildPageParams {
  childId: string;
  examinationId: string;
}

export default function DentalChildLayout(
  props: PropsWithChildren<DentalChildPageProps>,
) {
  return (
    <StickyToolbarLayout
      toolbar={<ChildToolbar childId={props.params.childId} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
