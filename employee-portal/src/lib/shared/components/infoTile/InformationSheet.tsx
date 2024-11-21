/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet, SheetProps, Stack } from "@mui/joy";
import { PropsWithChildren } from "react";

export function InformationSheet({
  children,
  sx,
  dataTestId,
  ...props
}: PropsWithChildren<SheetProps & { dataTestId?: string }>) {
  return (
    <Sheet
      sx={{
        borderRadius: "lg",
        padding: 3,
        flex: 1,
        display: "flex",
        ...sx,
      }}
      data-testid={dataTestId}
      {...props}
    >
      <Stack gap={2} sx={{ flexGrow: 1, width: "100%" }}>
        {children}
      </Stack>
    </Sheet>
  );
}
