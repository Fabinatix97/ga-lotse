/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function NewAppointmentBlockGroupPage() {
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
