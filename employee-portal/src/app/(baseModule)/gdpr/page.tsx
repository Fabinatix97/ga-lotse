/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGdprProcedureSortKey,
  ApiGdprProcedureType,
  ApiSortDirection,
  GetGdprProceduresRequest,
} from "@eshg/base-api";
import {
  parseOptionalEnum,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/helpers/searchParams";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { GDPRTable } from "@/lib/baseModule/components/gdpr/overview/GDPRTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

function parseSearchParams(
  searchParams: ReadonlyURLSearchParams,
): GetGdprProceduresRequest {
  return {
    type: parseOptionalEnum(ApiGdprProcedureType, searchParams.get("type")),
    ...parseReadonlyPageParams(searchParams),
    sortKey: parseOptionalEnum(
      ApiGdprProcedureSortKey,
      searchParams.get("sortKey"),
    ),
    sortDirection: parseOptionalEnum(
      ApiSortDirection,
      searchParams.get("sortDirection"),
    ),
  };
}

export default function GDPROverviewPage() {
  const searchParams = useSearchParams();
  const validatedParams = parseSearchParams(searchParams);
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="DSGVO Vorgänge" />}>
      <MainContentLayout fullViewportHeight>
        <GDPRTable params={validatedParams} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
