/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";

interface UndecipheredMessageProps {
  isSent: boolean;
}

export function UndecipheredMessage({
  isSent,
}: Readonly<UndecipheredMessageProps>) {
  return (
    <Sheet
      color={isSent ? "primary" : "neutral"}
      variant={isSent ? "solid" : "soft"}
      sx={{
        p: 1,
        borderRadius: "md",
        backgroundColor: isSent ? "primary.500" : "neutral.100",
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      <Stack direction="row" alignItems="center">
        <LockOutlinedIcon
          sx={{
            color: isSent ? "background.body" : "text.primary",
            opacity: 0.5,
          }}
        />
        <Typography
          component="div"
          level="body-md"
          sx={{
            color: isSent ? "background.body" : "text.primary",
            paddingLeft: 0.3,
            paddingRight: 0.5,
            opacity: 0.5,
          }}
        >
          Entschlüsselung fehlgeschlagen
        </Typography>
      </Stack>
    </Sheet>
  );
}
