/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { useParams, useRouter } from "next/navigation";

import { AuditLogAuthorizePage } from "@/lib/baseModule/components/auditlog/authorize/AuditLogAuthorizePage";
import { AuditLogAuthorizeSidebar } from "@/lib/baseModule/components/auditlog/authorize/AuditLogAuthorizeSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { SearchParams } from "@/lib/shared/helpers/searchParams";

export default function AuditLogAuthorizeAccessPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  const router = useRouter();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  const { source } = useParams();
  const openSidebar = typeof source === "string";

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auditlog Freigabe" />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.AuditlogAuthorizeAccess}>
          <AuditLogAuthorizePage searchParams={props.searchParams} />
          {openSidebar && (
            <OverlayBoundary>
              <AuditLogAuthorizeSidebar
                open={openSidebar}
                onClose={() =>
                  router.push(
                    buildRoutePreservingSearchParams(
                      routes.auditlog.authorize.index,
                    ),
                  )
                }
              />
            </OverlayBoundary>
          )}
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
