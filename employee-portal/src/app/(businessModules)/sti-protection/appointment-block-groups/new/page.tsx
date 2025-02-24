/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function NewAppointmentBlockGroupsPage() {
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
        <CreateAppointmentBlockGroupForm />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
