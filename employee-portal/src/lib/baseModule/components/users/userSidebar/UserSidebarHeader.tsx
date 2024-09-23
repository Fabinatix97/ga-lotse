/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { DialogTitle, Stack, Typography } from "@mui/joy";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function UserSidebarHeader({ selfUser }: { selfUser: ApiUser }) {
  return (
    <Stack
      direction={"row"}
      gap={2}
      alignItems={"center"}
      sx={{
        paddingRight: sidebarPadding,
      }}
    >
      <UserAvatar user={selfUser} size={"lg"} />
      <Stack
        sx={{
          minWidth: 0,
          "> *": {
            textWrap: "nowrap",
            textOverflow: "ellipsis",
            overflow: "clip",
          },
        }}
      >
        <DialogTitle
          sx={{ color: "text.primary" }}
          component={"h1"}
          level={"h3"}
        >
          {fullName(selfUser)}
        </DialogTitle>
        <Typography>@{selfUser.username}</Typography>
      </Stack>
    </Stack>
  );
}
