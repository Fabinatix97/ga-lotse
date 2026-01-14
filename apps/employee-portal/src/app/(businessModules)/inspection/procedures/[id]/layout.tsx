/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { InspectionTabNavigationToolbar } from "@/lib/businessModules/inspection/components/inspection/InspectionTabNavigationToolbar";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EditInspectionRouteParams = {
  id: string;
};

export default async function EditInspectionLayout(
  props: DynamicLayoutProps<EditInspectionRouteParams>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout
      toolbar={<InspectionTabNavigationToolbar inspectionId={id} />}
    >
      {props.children}
    </StickyToolbarLayout>
  );
}
