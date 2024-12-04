/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export type ProphylaxisSessionPageProps = Readonly<{
  params: ProphylaxisSessionPageParams;
}>;

interface ProphylaxisSessionPageParams {
  prophylaxisSessionId: string;
}

export default function ProphylaxisSessionPageLayout(
  props: PropsWithChildren<ProphylaxisSessionPageProps>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Prophylaxe" />}>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
