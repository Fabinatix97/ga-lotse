/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface MedicalHistorySectionElementProps {
  dataTestId: string;
}

export function MedicalHistorySectionElement({
  dataTestId,
  children,
}: Readonly<MedicalHistorySectionElementProps & RequiresChildren>) {
  return (
    <Stack
      data-testid={dataTestId}
      sx={{
        flexDirection: "row",
      }}
    >
      <Stack
        sx={{
          justifyContent: "space-between",
          flexDirection: "column",
          flex: 1,
          display: "flex",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
