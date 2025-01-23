/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { AuditLogAuthorizePage } from "@/lib/auditlog/components/authorize/AuditLogAuthorizePage";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
