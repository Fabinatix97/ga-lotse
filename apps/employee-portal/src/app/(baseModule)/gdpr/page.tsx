/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import {
  ApiGdprProcedureSortKey,
  ApiGdprProcedureType,
  ApiSortDirection,
  GetGdprProceduresRequest,
} from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import {
  parseOptionalEnum,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/universal";

import { GDPRTable } from "@/lib/baseModule/components/gdpr/overview/GDPRTable";

function parseSearchParams(
  searchParams: ReadonlyURLSearchParams,
): GetGdprProceduresRequest {
  return {
    type: parseOptionalEnum(ApiGdprProcedureType, searchParams.get("type")),
    ...parseReadonlyPageParams(searchParams),
    sortKey:
      parseOptionalEnum(ApiGdprProcedureSortKey, searchParams.get("sortKey")) ??
      ApiGdprProcedureSortKey.CreatedAt,
    sortDirection:
      parseOptionalEnum(ApiSortDirection, searchParams.get("sortDirection")) ??
      ApiSortDirection.Asc,
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
