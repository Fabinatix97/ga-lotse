/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { ChildToolbar } from "@/features/children/components/ChildToolbar";
import { useChildRouteParams } from "@/features/children/hooks/useChildRouteParams";

export function DentalChildLayout(props: DynamicLayoutProps) {
  const { childId } = useChildRouteParams(props.params);

  return (
    <StickyToolbarLayout toolbar={<ChildToolbar childId={childId} />}>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
