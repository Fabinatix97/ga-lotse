/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/joy";

import { webSearchApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetWebSearchOverview } from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchTable } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchTable";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";

export function FacilitiesWebSearchPageContent() {
  const { data, isFetching } = useGetWebSearchOverview();

  return (
    <>
      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mb: 2 }}>
        <RefreshButton
          loading={isFetching}
          queryKey={webSearchApiQueryKey(["getWebSearchOverview"])}
        />
        <InternalLinkButton
          href={routes.facilities.webSearch.new}
          startDecorator={<Add />}
        >
          Neue Suche erstellen
        </InternalLinkButton>
      </Box>
      <FacilityWebSearchTable data={data} loading={isFetching} />
    </>
  );
}
