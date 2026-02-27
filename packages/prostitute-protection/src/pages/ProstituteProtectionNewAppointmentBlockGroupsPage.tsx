/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { CreateAppointmentBlockGroupForm } from "../components/appointmentBlocks/ProstituteProtectionCreateAppointmentBlockGroupForm";
import { routes } from "../config/routes";

export function ProstituteProtectionNewAppointmentBlockGroupsPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Terminblock planen"
          backButton={<ToolbarBackButton href={routes.appointments.index} />}
        />
      }
    >
      <MainContentLayout>
        <CreateAppointmentBlockGroupForm />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
