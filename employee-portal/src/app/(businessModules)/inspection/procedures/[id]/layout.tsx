/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { InspectionTabNavigationToolbar } from "@/lib/businessModules/inspection/components/inspection/InspectionTabNavigationToolbar";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

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
    </StickyToolbarLayout>
  );
}
