/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { ChildToolbar } from "../components/ChildToolbar";
import { useChildRouteParams } from "../hooks/useChildRouteParams";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type DentalChildRouteParams = {
  childId: string;
};

export function DentalChildLayout(
  props: DynamicLayoutProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);

  return (
    <StickyToolbarLayout toolbar={<ChildToolbar childId={childId} />}>
      <MainContentLayout fullViewportHeight>
        <Box display="contents" role="tabpanel">
          {props.children}
        </Box>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
