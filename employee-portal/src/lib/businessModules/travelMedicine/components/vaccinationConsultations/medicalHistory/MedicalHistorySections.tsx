/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack } from "@mui/joy";

export function MedicalHistorySections({
  children,
}: Readonly<RequiresChildren>) {
  return <Stack gap={2}>{children}</Stack>;
}
