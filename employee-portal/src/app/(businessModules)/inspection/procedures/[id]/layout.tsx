/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { PropsWithChildren } from "react";

import { InspectionTabNavigationToolbar } from "@/lib/businessModules/inspection/components/inspection/InspectionTabNavigationToolbar";
import { TrackInspectionView } from "@/lib/businessModules/inspection/components/inspection/TrackInspectionView";

export interface EditInspectionPageParams {
  id: string;
}

export default function EditInspectionLayout({
  params,
  children,
}: PropsWithChildren<{ params: EditInspectionPageParams }>) {
  return (
    <StickyToolbarLayout
      toolbar={<InspectionTabNavigationToolbar inspectionId={params.id} />}
    >
      {children}
      <TrackInspectionView inspectionId={params.id} />
    </StickyToolbarLayout>
  );
}
