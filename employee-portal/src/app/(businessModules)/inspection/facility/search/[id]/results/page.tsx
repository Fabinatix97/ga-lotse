/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import * as v from "valibot";

import {
  useGetWebSearchById,
  useSearchInWebSearch,
} from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchResultsTable } from "@/lib/businessModules/inspection/components/facility/search/results/FacilityWebSearchResultsTable";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { FacilityWebSearchFiltersSchema } from "@/lib/businessModules/inspection/shared/types";

export default function FacilityWebSearchResultsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;
  const searchParams = props.searchParams;
  const filters = v.parse(FacilityWebSearchFiltersSchema, searchParams);

  const { data: searchResult, isFetching } = useSearchInWebSearch(id, filters);
  const { data: webSearch } = useGetWebSearchById(id);

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
