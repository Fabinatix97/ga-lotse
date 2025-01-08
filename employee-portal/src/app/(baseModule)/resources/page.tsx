/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiResourceSortKey,
  ApiResourceType,
  ApiSortDirection,
  GetResourcesRequest,
} from "@eshg/employee-portal-api/base";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { ResourcesTable } from "@/lib/baseModule/components/resources/ResourcesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import {
  parseOptionalEnum,
  parseOptionalString,
  parseReadonlyPageParams,
} from "@/lib/shared/helpers/searchParams";

function parseSearchParams(
  searchParams: ReadonlyURLSearchParams,
): GetResourcesRequest {
  return {
    type: parseOptionalEnum(ApiResourceType, searchParams.get("type")),
    name: parseOptionalString(searchParams.get("name")),
    label: parseOptionalString(searchParams.get("label")),
    ...parseReadonlyPageParams(searchParams),
    sortKey: parseOptionalEnum(ApiResourceSortKey, searchParams.get("sortKey")),
    sortDirection: parseOptionalEnum(
      ApiSortDirection,
      searchParams.get("sortDirection"),
    ),
  };
}

export default function ResourcesOverviewPage() {
  const searchParams = useSearchParams();
  const params = parseSearchParams(searchParams);
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Ressourcen" />}>
      <MainContentLayout fullViewportHeight>
        <ResourcesTable params={params} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
