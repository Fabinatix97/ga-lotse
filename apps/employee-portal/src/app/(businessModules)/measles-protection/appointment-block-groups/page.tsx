/**
 * Copyright 2026 cronn GmbH
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

import { MeaslesProtectionAppointmentBlockGroupsTable } from "@/lib/businessModules/measlesProtection/components/appointmentBlocks/MeaslesProtectionAppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

export default function AppointmentBlockGroupsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminblöcke Übersicht" />}>
      <MainContentLayout fullViewportHeight>
        <MeaslesProtectionAppointmentBlockGroupsTable
          controls={
            <ButtonBar
              left={<ToggleFilterButton disabled />}
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
