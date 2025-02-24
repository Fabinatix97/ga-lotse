/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
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
