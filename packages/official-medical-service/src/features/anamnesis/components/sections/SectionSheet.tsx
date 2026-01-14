/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Sheet, Stack, Typography } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface SectionSheetProps extends RequiresChildren {
  title: string;
  citizen?: boolean;
}

export function SectionSheet({ title, citizen, children }: SectionSheetProps) {
  const stackSx = !citizen ? { width: 2 / 3 } : undefined;

  return (
    <Sheet sx={{ padding: 3 }} component="section">
      <Stack gap={5}>
        <Typography level="h3">{title}</Typography>
        <Stack direction="column" gap={3} divider={<Divider />} sx={stackSx}>
          {children}
        </Stack>
      </Stack>
    </Sheet>
  );
}
