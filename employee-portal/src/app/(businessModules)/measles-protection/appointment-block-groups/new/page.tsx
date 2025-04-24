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

import { useGetAppointmentDurations } from "@/lib/businessModules/measlesProtection/api/queries/appointmentTypeApi";
import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/measlesProtection/components/appointmentBlocks/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

export default function NewAppointmentBlockGroupsPage() {
  const { data: appointmentDurationsMeasles } = useGetAppointmentDurations();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Terminblock planen"
          backButton={
            <ToolbarBackButton href={routes.appointmentBlockGroups.index} />
          }
        />
      }
    >
      <MainContentLayout>
        <CreateAppointmentBlockGroupForm
          appointmentDurationsMeasles={appointmentDurationsMeasles}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
