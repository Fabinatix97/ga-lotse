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
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import {
  parseOptionalEnum,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/helpers/searchParams";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

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
