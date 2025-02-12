/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  parseOptionalEnum,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/helpers/searchParams";
import {
  ApiGdprValidationTaskSortKey,
  ApiSortDirection,
  GetAllGdprValidationTasksRequest,
} from "@eshg/lib-procedures-api";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { ValidationTasksTable } from "@/lib/baseModule/components/gdpr/validationTasks/ValidationTasksTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { isBusinessModule } from "@/lib/shared/helpers/guards";

function parseSearchParams(
  searchParams: ReadonlyURLSearchParams,
): GetAllGdprValidationTasksRequest {
  return {
    ...parseReadonlyPageParams(searchParams),
    sortKey:
      parseOptionalEnum(
        ApiGdprValidationTaskSortKey,
        searchParams.get("sortKey"),
      ) ?? ApiGdprValidationTaskSortKey.CreatedAt,
    sortDirection:
      parseOptionalEnum(ApiSortDirection, searchParams.get("sortDirection")) ??
      ApiSortDirection.Asc,
  };
}

export default function ValidationTaskOverviewPage({
  params,
}: Readonly<{
  params: { businessModule: string };
}>) {
  const businessModule = params.businessModule;
  if (!isBusinessModule(businessModule)) {
    throw new Error(
      `Tried to open validation task overview for unknown business module type '${businessModule}'`,
    );
  }

  const searchParams = useSearchParams();
  const request = parseSearchParams(searchParams);

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="DSGVO Aufträge" />}>
      <MainContentLayout fullViewportHeight>
        <ValidationTasksTable
          request={request}
          businessModule={businessModule}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
