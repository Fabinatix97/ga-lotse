/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Schedule } from "@mui/icons-material";

import {
  ButtonBar,
  MainContentLayout,
  StickyToolbarLayout,
  ToggleFilterButton,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { AppointmentBlockGroupsTable } from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksTable/AppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export default function AppointmentBlockGroupsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminblöcke Übersicht" />}>
      <MainContentLayout fullViewportHeight>
        <AppointmentBlockGroupsTable
          controls={
            <ButtonBar
              left={<ToggleFilterButton disabled />}
              right={
                <InternalLinkButton
                  href={routes.appointments.appointmentBlockGroups.new}
                  size="sm"
                  startDecorator={<Schedule />}
                >
                  Terminblock planen
                </InternalLinkButton>
              }
            />
          }
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
