/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

export function InfectionBriefingOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Lebensmittelausweis" />}>
      <MainContentLayout fullViewportHeight>
        <Typography>Infection Briefing Procedures Table</Typography>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
