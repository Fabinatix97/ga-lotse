/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Schedule } from "@mui/icons-material";

import { AppointmentBlockGroupsTable } from "@/lib/businessModules/measlesProtection/components/appointmentBlocks/AppointmentBlockGroupsTable";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
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
              left={<FilterButton disabled />}
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
