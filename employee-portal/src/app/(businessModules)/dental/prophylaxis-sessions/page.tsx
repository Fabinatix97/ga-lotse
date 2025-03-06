/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useCreateProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/CreateProphylaxisSessionSidebar";
import { ProphylaxisSessionsTable } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionsTable";

function CreateProphylaxisSessionButton() {
  const createProphylaxisSessionSidebar = useCreateProphylaxisSessionSidebar();

  return (
    <Button
      startDecorator={<Add />}
      onClick={createProphylaxisSessionSidebar.open}
    >
      Prophylaxe anlegen
    </Button>
  );
}

export default function DentalProceduresPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Prophylaxen" />}>
      <MainContentLayout fullViewportHeight>
        <ProphylaxisSessionsTable
          buttons={[
            <CreateProphylaxisSessionButton key="createProphylaxisSession" />,
          ]}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
