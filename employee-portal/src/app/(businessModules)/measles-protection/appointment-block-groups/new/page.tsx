/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
