/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminActorSelector,
  ApiAdminCertificate,
  instanceOfApiAdminActorSelector,
  instanceOfApiAdminCertificate,
} from "@eshg/admin-portal-api/serviceDirectory";
import { ColorPaletteProp, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isObjectType } from "remeda";

import { CertificateDialogButton } from "@/lib/components/button/CertificateDialogButton";
import { formatActorSelector } from "@/lib/components/table/cell/StaticActorSelectorCell";

export function ColoredText<
  TValue extends
    | undefined
    | string
    | boolean
    | ApiAdminCertificate
    | Date
    | ApiAdminActorSelector,
>({
  value,
  color,
}: Readonly<{ value: TValue; color?: ColorPaletteProp }>): ReactNode {
  if (value == null) {
    return false;
  }
  if (value instanceof Date) {
    return (
      <Typography color={color} sx={{ display: "contents" }}>
        {value.toISOString()}
      </Typography>
    );
  }
  if (isApiAdminCertificate(value)) {
    return <CertificateDialogButton value={value} />;
  }
  if (isApiAdminActorSelector(value)) {
    return (
      <Typography color={color} sx={{ display: "contents" }}>
        {formatActorSelector(value)}
      </Typography>
    );
  }
  return (
    <Typography color={color} sx={{ display: "contents" }}>
      {value.toString()}
    </Typography>
  );
}

function isApiAdminCertificate(value: unknown): value is ApiAdminCertificate {
  return isObjectType(value) && instanceOfApiAdminCertificate(value);
}

function isApiAdminActorSelector(
  value: unknown,
): value is ApiAdminActorSelector {
  return isObjectType(value) && instanceOfApiAdminActorSelector(value);
}
