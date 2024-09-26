/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import { PendingFacilitiesOfflineTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesOfflineTable";
import { PendingFacilitiesTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTable";
import { SearchParams } from "@/lib/shared/helpers/searchParams";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function PendingFacilities(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  const isOffline = useIsOffline();

  if (isOffline) {
    return (
      <Stack spacing={3}>
        <Typography level="h2">Offline verfügbare Begehungen</Typography>
        <PendingFacilitiesOfflineTable />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <PendingFacilitiesTable filter={props.searchParams} />
    </Stack>
  );
}
