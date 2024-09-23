/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack } from "@mui/joy";

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
      style={{
        flexDirection: "row",
      }}
    >
      <Stack
        style={{
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
