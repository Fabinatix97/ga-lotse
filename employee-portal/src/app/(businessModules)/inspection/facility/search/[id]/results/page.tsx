/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  useGetWebSearchById,
  useSearchInWebSearch,
} from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchResultsTable } from "@/lib/businessModules/inspection/components/facility/search/results/FacilityWebSearchResultsTable";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { FacilityWebSearchFilters } from "@/lib/businessModules/inspection/shared/types";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { SearchParams } from "@/lib/shared/helpers/searchParams";

type EditFacilityPageProps = Readonly<{
  params: { id: string };
  searchParams: SearchParams;
}>;

export default function FacilityWebSearchResultsPage(
  props: EditFacilityPageProps,
) {
  const filters: FacilityWebSearchFilters = props.searchParams;

  const { data: searchResult, isFetching } = useSearchInWebSearch(
    props.params.id,
    filters,
  );
  const { data: webSearch } = useGetWebSearchById(props.params.id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.facilities.webSearch.index}
          title={`Web-Suche: ${webSearch.name}`}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <FacilityWebSearchResultsTable
          webSearch={webSearch}
          filters={filters}
          data={searchResult}
          loading={isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
