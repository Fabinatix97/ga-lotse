/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetAppointmentDurations } from "@/lib/businessModules/measlesProtection/api/queries/appointmentTypeApi";
import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/measlesProtection/components/appointmentBlocks/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function NewAppointmentBlockGroupsPage() {
  const appointmentDurationsMeasles = useGetAppointmentDurations().data;

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Terminblock planen"
          backHref={routes.appointmentBlockGroups.index}
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
