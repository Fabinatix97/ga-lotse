/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import WebAssetOffOutlinedIcon from "@mui/icons-material/WebAssetOffOutlined";
import { Box, Stack, SvgIcon, Typography } from "@mui/joy";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "5.625rem",
        marginInline: 3,
        // component: "alert",
      }}
    >
      <Stack
        sx={{
          maxWidth: "46.25rem",
          width: "100%",
          padding: 3,
          backgroundColor: "background.body",
          borderRadius: "lg",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center", marginBottom: 3 }}>
          <SvgIcon sx={{ width: "8.125rem", height: "8.125rem" }}>
            <WebAssetOffOutlinedIcon />
          </SvgIcon>
          <Typography level="h1" textAlign="center" data-testid="title">
            Seite nicht gefunden
          </Typography>
          <Typography textAlign="center" data-testid="message">
            Leider funktioniert der eingegebene Link nicht oder die Seite wurde
            entfernt.
          </Typography>
        </Stack>
        <InternalLinkButton href="/">Zur Startseit</InternalLinkButton>
      </Stack>
    </Box>
  );
}
