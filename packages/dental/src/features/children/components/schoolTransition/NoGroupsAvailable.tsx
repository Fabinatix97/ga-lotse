/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TableRowsOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

export function NoGroupsAvailable({ href }: { href: string }) {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 2,
      }}
    >
      <Typography fontWeight={600}>Alle Gruppen bearbeitet.</Typography>
      <InternalLinkButton href={href} endDecorator={<TableRowsOutlined />}>
        Zurück zur Übersicht
      </InternalLinkButton>
    </Stack>
  );
}
