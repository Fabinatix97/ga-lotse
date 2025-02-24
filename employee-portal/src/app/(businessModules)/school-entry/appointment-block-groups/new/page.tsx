/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { CreateAppointmentBlockGroupForm } from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export default function NewAppointmentBlockPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Terminblock planen"
          backHref={routes.appointmentBlockGroups.overview}
        />
      }
    >
      <MainContentLayout>
        <CreateAppointmentBlockGroupForm />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
