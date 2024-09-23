/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminCertificate } from "@eshg/admin-portal-api/serviceDirectory";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { CertificateDialogButton } from "@/lib/components/button/CertificateDialogButton";
import { EmptyCell } from "@/lib/components/table/cell/EmptyCell";

export function CertificateCell<TData>(
  props: CellContext<TData, ApiAdminCertificate>,
): ReactNode {
  const val: ApiAdminCertificate = props.getValue();
  if (!val) {
    return <EmptyCell />;
  }
  return <CertificateDialogButton value={val} />;
}
