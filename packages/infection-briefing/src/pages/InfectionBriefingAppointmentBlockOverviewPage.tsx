/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Schedule } from "@mui/icons-material";

import {
  ButtonBar,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { InfectionBriefingAppointmentBlockGroupsTable } from "../components/appointmentBlocks/InfectionBriefingAppointmentBlockGroupsTable";
import { routes } from "../config/routes";

export function InfectionBriefingAppointmentBlockOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminblöcke Übersicht" />}>
      <MainContentLayout fullViewportHeight>
        <InfectionBriefingAppointmentBlockGroupsTable
          controls={
            <ButtonBar
              right={
                <InternalLinkButton
                  autoFocus
                  href={routes.appointmentBlockGroups.new}
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
