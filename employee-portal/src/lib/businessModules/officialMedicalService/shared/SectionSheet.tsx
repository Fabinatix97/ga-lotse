/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Divider, Sheet, Stack, StackProps, Typography } from "@mui/joy";

interface SectionSheetProps extends RequiresChildren {
  title: string;
  slotProps?: {
    stack: Pick<StackProps, "sx">;
  };
}

export function SectionSheet({
  title,
  slotProps,
  children,
}: SectionSheetProps) {
  return (
    <Sheet sx={{ padding: 3 }} component="section">
      <Stack gap={5}>
        <Typography level="h3">{title}</Typography>
        <Stack
          direction="column"
          gap={3}
          divider={<Divider />}
          sx={slotProps?.stack.sx}
        >
          {children}
        </Stack>
      </Stack>
    </Sheet>
  );
}
