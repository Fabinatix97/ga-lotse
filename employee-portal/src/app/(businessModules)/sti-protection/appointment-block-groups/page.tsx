/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Schedule } from "@mui/icons-material";

import { AppointmentBlockGroupsTable } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/AppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
