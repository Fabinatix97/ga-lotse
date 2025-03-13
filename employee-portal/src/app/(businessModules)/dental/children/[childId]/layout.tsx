/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildToolbar } from "@eshg/dental";
import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type DentalChildRouteParams = {
  childId: string;
  examinationId: string;
};

export default function DentalChildLayout(
  props: DynamicLayoutProps<DentalChildRouteParams>,
) {
  const { childId } = props.params;

  return (
    <StickyToolbarLayout toolbar={<ChildToolbar childId={childId} />}>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
