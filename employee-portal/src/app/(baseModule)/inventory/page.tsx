/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInventoryItemType,
  ApiInventorySortKey,
  ApiSortDirection,
  GetInventoryItemsRequest,
} from "@eshg/employee-portal-api/base";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { InventoryTable } from "@/lib/baseModule/components/inventory/InventoryTable";
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
): GetInventoryItemsRequest {
  return {
    type: parseOptionalEnum(ApiInventoryItemType, searchParams.get("type")),
    name: parseOptionalString(searchParams.get("name")),
    label: parseOptionalString(searchParams.get("label")),
    ...parseReadonlyPageParams(searchParams),
    sortKey: parseOptionalEnum(
      ApiInventorySortKey,
      searchParams.get("sortKey"),
    ),
    sortDirection: parseOptionalEnum(
      ApiSortDirection,
      searchParams.get("sortDirection"),
    ),
  };
}

export default function InventoryOverviewPage() {
  const searchParams = useSearchParams();
  const params = parseSearchParams(searchParams);
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Inventar"} />}>
      <MainContentLayout fullViewportHeight>
        <InventoryTable params={params} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
