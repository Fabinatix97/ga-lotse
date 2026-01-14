/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/base-api";
import { ArchiveAdminPage } from "@eshg/lib-employee-portal";

import { useDentalApi } from "../contexts/dental";
import { DENTAL_MODULE_NAME } from "../translations/businessModule";

export function DentalArchiveAdminPage() {
  const { archivingApi } = useDentalApi();

  return (
    <ArchiveAdminPage
      businessModule={ApiBusinessModule.Dental}
      title={DENTAL_MODULE_NAME}
      archivingApi={archivingApi}
    />
  );
}
