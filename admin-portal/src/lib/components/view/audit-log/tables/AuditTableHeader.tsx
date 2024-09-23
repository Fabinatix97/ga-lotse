/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

export function AuditTableHeader({ title }: Readonly<{ title: string }>) {
  return (
    <Typography paddingTop="0.75rem" level="h3">
      {title}
    </Typography>
  );
}
