/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiContactCategory,
  ApiContactSortKey,
  ApiContactType,
  ApiSortDirection,
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
} from "@eshg/lib-portal/helpers/searchParams";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import {
  ContactOverviewSearchParams,
  ContactsOverview,
} from "@/lib/baseModule/components/contacts/ContactsOverview";
import { contactSearchParamNames } from "@/lib/baseModule/components/contacts/constants";

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
