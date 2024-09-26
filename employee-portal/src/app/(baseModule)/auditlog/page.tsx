/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAuditLogFeature } from "@eshg/employee-portal-api/auditlog";
import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { PortalError } from "@eshg/lib-portal/errorHandling/PortalError";
import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";

import { AuditlogAccessibleTableView } from "@/lib/auditlog/components/AuditlogAccessibleTableView";
import { AuditlogCreatePasswordView } from "@/lib/auditlog/components/AuditlogCreatePasswordView";
import { AuditlogRecordingView } from "@/lib/auditlog/components/AuditlogRecordingView";
import { useIsNewFeatureEnabled } from "@/lib/auditlog/queries/featureToggles";
import { useGetEmployeePrivateUserKey } from "@/lib/baseModule/api/queries/users";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function AuditlogPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Auditlog"} />}>
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.AuditlogDecryptAndAccess}>
          <AuditlogView />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function AuditlogView() {
  const { data: response } = useGetEmployeePrivateUserKey();
  const isAuditlogAccessibleTableEnabled = useIsNewFeatureEnabled(
    ApiAuditLogFeature.AuditLogAccessibleTable,
  );

  function isPortalErrorNotFound() {
    return (
      response instanceof PortalError &&
      response.errorCode === PortalErrorCode.NotFound
    );
  }

  if (isPortalErrorNotFound()) {
    return <AuditlogCreatePasswordView />;
  }

  if (isAuditlogAccessibleTableEnabled) {
    return <AuditlogAccessibleTableView />;
  } else {
    return <AuditlogRecordingView />;
  }
}
