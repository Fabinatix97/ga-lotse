/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { VaccinationConsultationTabNavigationToolbar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationTabNavigationToolbar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

export default function VaccinationConsultationDetailsLayout({
  params,
  children,
}: PropsWithChildren<{
  params: EditInspectionPageParams;
}>) {
  return (
    <StickyToolbarLayout
      toolbar={<VaccinationConsultationTabNavigationToolbar id={params.id} />}
    >
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
