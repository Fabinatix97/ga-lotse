/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ApiAdminCertificate } from "@eshg/service-directory-api";

import { CertificateDialogButton } from "@/lib/components/button/CertificateDialogButton";
import { EditableCertificateCell } from "@/lib/components/table/cell/EditableCertificateCell";
import { EmptyCell } from "@/lib/components/table/cell/EmptyCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { useEditableRow } from "@/lib/helpers/entityFilter";

export function CertificateCell(
  props: CellContext<Actor, ApiAdminCertificate>,
): ReactNode {
  if (useEditableRow(props.row) && props.row.original.manualCertificate) {
    return <EditableCertificateCell {...props} />;
  }

  const val: ApiAdminCertificate = props.getValue();
  if (!val) {
    return <EmptyCell />;
  }
  return <CertificateDialogButton value={val} />;
}
