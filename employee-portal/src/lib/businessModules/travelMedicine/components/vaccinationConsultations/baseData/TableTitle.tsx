/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

export function TableTitle(props: Readonly<{ title: string }>) {
  return (
    <Stack
      paddingX={1}
      paddingTop={1}
      paddingBottom={2}
      direction="row"
      alignItems="center"
    >
      <Typography component="h2" level="h4">
        {props.title}
      </Typography>
    </Stack>
  );
}
