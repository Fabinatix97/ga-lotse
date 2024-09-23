/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack } from "@mui/joy";

interface MedicalHistorySectionPros {
  dataTestId: string;
}

export function MedicalHistorySection({
  dataTestId,
  children,
}: Readonly<MedicalHistorySectionPros & RequiresChildren>) {
  return (
    <Stack
      data-testid={dataTestId}
      spacing={2}
      style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
    >
      {children}
    </Stack>
  );
}
