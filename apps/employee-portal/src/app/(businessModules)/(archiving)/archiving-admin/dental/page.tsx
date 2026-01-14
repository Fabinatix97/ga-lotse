/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalArchiveAdminPage, DentalProvider } from "@eshg/dental";
import { SidebarScope } from "@eshg/lib-employee-portal";

import { env } from "@/env/server";

export default function DentalArchiveAdminContainerPage() {
  return (
    <DentalProvider baseUrl={env.PUBLIC_DENTAL_BACKEND_URL}>
      <SidebarScope>
        <DentalArchiveAdminPage />
      </SidebarScope>
    </DentalProvider>
  );
}
