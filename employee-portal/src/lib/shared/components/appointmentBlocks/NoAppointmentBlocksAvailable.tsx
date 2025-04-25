/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Schedule, TodayOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

export function NoAppointmentBlocksAvailable({ href }: { href: string }) {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <TodayOutlined sx={{ height: "40px", width: "40px" }} />
      <Typography sx={{ mt: 2, mb: 3 }}>
        Aktuell keine Terminblöcke vorhanden
      </Typography>
      <InternalLinkButton href={href} size="sm" startDecorator={<Schedule />}>
        Neuen Terminblock planen
      </InternalLinkButton>
    </Stack>
  );
}
