/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

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
      sx={{ marginLeft: 1.5, marginRight: 1.5, marginTop: 1.5 }}
    >
      {children}
    </Stack>
  );
}
