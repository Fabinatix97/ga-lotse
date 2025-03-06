/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { AuditLogAuthorizePage } from "@/lib/auditlog/components/authorize/AuditLogAuthorizePage";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function AuditLogAuthorizeAccessPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auditlog Freigabe" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.AuditlogAuthorizeAccess}>
          <AuditLogAuthorizePage searchParams={props.searchParams} />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
