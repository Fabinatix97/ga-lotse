/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { notFound } from "next/navigation";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { ApiSchoolEntryFeature } from "@eshg/school-entry-api";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { SchoolEntryAppointmentOverview } from "@/lib/businessModules/schoolEntry/features/appointments/SchoolEntryAppointmentOverview";

export default function AppointmentBlockGroupsOverviewPage() {
  const isAppointmentBlockViewEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.AppointmentBlockView,
  );

  if (!isAppointmentBlockViewEnabled) {
    notFound();
  }
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminübersicht" />}>
      <MainContentLayout fullViewportHeight>
        <SchoolEntryAppointmentOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
