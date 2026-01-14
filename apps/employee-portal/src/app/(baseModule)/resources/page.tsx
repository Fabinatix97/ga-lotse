/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import {
  ApiResourceSortKey,
  ApiResourceType,
  ApiSortDirection,
  GetResourcesRequest,
} from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import {
  parseOptionalEnum,
  parseOptionalString,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/universal";

import { ResourcesTable } from "@/lib/baseModule/components/resources/ResourcesTable";

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
