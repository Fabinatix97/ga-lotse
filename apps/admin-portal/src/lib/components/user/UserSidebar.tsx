/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Person } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { LegalLinkList } from "@/lib/components/view/legal/LegalLinkList";
import { getAdminName } from "@/lib/helpers/adminName";

export function UserSidebar({
  onClick,
}: Readonly<{
  onClick: Dispatch<SetStateAction<boolean>>;
}>) {
  const adminName = getAdminName();
  const offset = new Date().getTimezoneOffset();
  const signum = Math.sign(offset) ? "+" : "-";
  const offsetHours = Math.floor(Math.abs(offset / 60))
    .toString()
    .padStart(2, "0");
  const offsetMins = Math.abs(offset % 60)
    .toString()
    .padStart(2, "0");
  const timeZone = `UTC${signum}${offsetHours}:${offsetMins} [${Intl.DateTimeFormat().resolvedOptions().timeZone}]`;

  return (
    <>
      <Stack alignItems="center" gap={1}>
        <Person color="inherit" />
        <Typography level="h3">{adminName}</Typography>
      </Stack>
      <Divider orientation="horizontal" />
      <Typography level="h4" color="neutral">
        {timeZone}
      </Typography>
      <Divider orientation="horizontal" />
      <Stack
        gap={1}
        height="100%"
        flexDirection="column"
        justifyContent="flex-end"
        onClick={() => onClick((prevState) => !prevState)}
      >
        <Divider orientation="horizontal" />
        <LegalLinkList />
      </Stack>
    </>
  );
}
