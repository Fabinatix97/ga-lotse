/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Schedule } from "@mui/icons-material";

import { AppointmentBlockGroupsTable } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/AppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function AppointmentBlockGroupsOverviewPage() {
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
