/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

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
