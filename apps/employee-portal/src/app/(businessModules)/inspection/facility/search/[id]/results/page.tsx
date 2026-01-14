/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

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
  const { id } = use(props.params);
  const searchParams = use(props.searchParams);
  const filters = v.parse(FacilityWebSearchFiltersSchema, searchParams);

  const { data: searchResult, isFetching } = useSearchInWebSearch(id, filters);
  const { data: webSearch } = useGetWebSearchById(id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Web-Suche: ${webSearch.name}`}
          backButton={
            <ToolbarBackButton href={routes.facilities.webSearch.index} />
          }
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
