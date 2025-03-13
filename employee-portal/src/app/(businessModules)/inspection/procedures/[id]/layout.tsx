/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { InspectionTabNavigationToolbar } from "@/lib/businessModules/inspection/components/inspection/InspectionTabNavigationToolbar";
import { TrackInspectionView } from "@/lib/businessModules/inspection/components/inspection/TrackInspectionView";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EditInspectionRouteParams = {
  id: string;
};

export default function EditInspectionLayout(
  props: DynamicLayoutProps<EditInspectionRouteParams>,
) {
  const { id } = props.params;

  return (
    <StickyToolbarLayout
      toolbar={<InspectionTabNavigationToolbar inspectionId={id} />}
    >
      {props.children}
      <TrackInspectionView inspectionId={id} />
    </StickyToolbarLayout>
  );
}
