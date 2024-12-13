/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiContactCategory,
  ApiContactSortKey,
  ApiContactType,
  ApiSortDirection,
} from "@eshg/employee-portal-api/base";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import {
  ContactOverviewSearchParams,
  ContactsOverview,
} from "@/lib/baseModule/components/contacts/ContactsOverview";
import { contactSearchParamNames } from "@/lib/baseModule/components/contacts/constants";
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
): ContactOverviewSearchParams {
  return {
    type: parseOptionalEnum(
      ApiContactType,
      searchParams.get(contactSearchParamNames.type),
    ),
    name: parseOptionalString(searchParams.get(contactSearchParamNames.name)),
    category: parseOptionalEnum(
      ApiContactCategory,
      searchParams.get(contactSearchParamNames.categories),
    ),
    ...parseReadonlyPageParams(searchParams),
    sortKey: parseOptionalEnum(ApiContactSortKey, searchParams.get("sortKey")),
    sortDirection: parseOptionalEnum(
      ApiSortDirection,
      searchParams.get("sortDirection"),
    ),
  };
}

export default function ContactsOverviewPage() {
  const searchParams = useSearchParams();
  const validatedParams = parseSearchParams(searchParams);
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kontakte"} />}>
      <MainContentLayout fullViewportHeight>
        <ContactsOverview params={validatedParams} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
