/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { ApiSchoolEntryFeature } from "@eshg/school-entry-api";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export default function NewAppointmentBlockPage() {
  const isAppointmentBlockViewEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.AppointmentBlockView,
  );
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Terminblock planen"
          backButton={
            <ToolbarBackButton
              href={
                isAppointmentBlockViewEnabled
                  ? routes.appointments.overview
                  : routes.appointments.appointmentBlockGroups.overview
              }
            />
          }
        />
      }
    >
      <MainContentLayout>
        <CreateAppointmentBlockGroupForm />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
