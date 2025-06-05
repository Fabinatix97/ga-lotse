/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import { useIsMobile } from "@eshg/lib-portal";

import { InformationCard } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/InformationCard";
import { OverviewSection } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/OverviewSection";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function SummaryStep() {
  const isMobile = useIsMobile();

  return (
    <Grid
      container
      spacing={2}
      sx={{ flexGrow: 1 }}
      direction={isMobile ? "row" : "row-reverse"}
    >
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <ContentSheet>
          <OverviewSection />
        </ContentSheet>
      </Grid>
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <InformationCard />
      </Grid>
    </Grid>
  );
}
