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
import { PageProps } from "@eshg/lib-portal/types/pageParams";

import { AuditLogAuthorizePage } from "@/lib/auditlog/components/authorize/AuditLogAuthorizePage";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function AuditLogAuthorizeAccessPage(props: PageProps) {
  const searchParams = props.searchParams;

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auditlog Freigabe" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.AuditlogAuthorizeAccess}>
          <AuditLogAuthorizePage searchParams={searchParams} />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
