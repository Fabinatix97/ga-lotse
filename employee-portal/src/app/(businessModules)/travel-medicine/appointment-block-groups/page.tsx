/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Schedule } from "@mui/icons-material";

import { AppointmentBlockGroupsTable } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/appointmentBlocksTable/AppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";

export default function AppointmentBlockGroupsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminblöcke Übersicht" />}>
      <MainContentLayout fullViewportHeight>
        <AppointmentBlockGroupsTable
          controls={
            <ButtonBar
              right={
                <InternalLinkButton
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
