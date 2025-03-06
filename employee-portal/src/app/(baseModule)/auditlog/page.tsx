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
import { PortalError } from "@eshg/lib-portal/errorHandling/PortalError";
import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";

import { AuditlogAccessibleTableView } from "@/lib/auditlog/components/AuditlogAccessibleTableView";
import { AuditlogCreatePasswordView } from "@/lib/auditlog/components/AuditlogCreatePasswordView";
import { useGetEmployeePrivateUserKey } from "@/lib/baseModule/api/queries/users";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

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
  function isPortalErrorNotFound() {
    return (
      response instanceof PortalError &&
      response.errorCode === PortalErrorCode.NotFound
    );
  }

  if (isPortalErrorNotFound()) {
    return <AuditlogCreatePasswordView />;
  }

  return (
    <AuditlogAccessibleTableView encryptedPrivateKey={response as string[]} />
  );
}
