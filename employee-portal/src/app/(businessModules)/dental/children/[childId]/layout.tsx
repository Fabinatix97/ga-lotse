/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { ChildToolbar } from "@/lib/businessModules/dental/features/children/details/ChildToolbar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

export type DentalChildPageProps = Readonly<{
  params: DentalChildPageParams;
}>;

export interface DentalChildPageParams {
  childId: string;
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
