/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { TablePage } from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Add } from "@mui/icons-material";

import { webSearchApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetWebSearchOverview } from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchTable } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchTable";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";

export function FacilitiesWebSearchPageContent() {
  const { data, isFetching } = useGetWebSearchOverview();

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          right={
            <>
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
            </>
          }
        />
      }
    >
      <FacilityWebSearchTable data={data} loading={isFetching} />
    </TablePage>
  );
}
