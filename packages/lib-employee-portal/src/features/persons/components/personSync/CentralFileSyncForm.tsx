/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { PropsWithChildren, useId } from "react";

import { SyncFormButtonBar, SyncFormButtonBarProps } from "./SyncFormButtonBar";
import { SyncFormGrid } from "./SyncFormGrid";

interface CentralFileSyncFormProps
  extends SyncFormButtonBarProps, PropsWithChildren {
  title: string;
}

export function CentralFileSyncForm({
  title,
  children,
  onAccept,
  onCancel,
}: CentralFileSyncFormProps) {
  const titleId = useId();
  return (
    <Stack
      component="section"
      role="form"
      aria-labelledby={titleId}
      gap={2}
      sx={{ maxWidth: 1800 }}
    >
      <Sheet>
        <Stack gap={1}>
          <Typography component="h2" level="h3" id={titleId}>
            Update verfügbar: {title}
          </Typography>

          <Divider />

          <SyncFormGrid>{children}</SyncFormGrid>
        </Stack>
      </Sheet>

      <SyncFormButtonBar onAccept={onAccept} onCancel={onCancel} />
    </Stack>
  );
}
