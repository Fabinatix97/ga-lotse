/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { Badge, DialogTitle, Stack, Typography } from "@mui/joy";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { useGetSelfUserPresence } from "@/lib/businessModules/chat/shared/hooks/useGetSelfUserPresence";
import {
  getPresenseLabel,
  getStatusColor,
} from "@/lib/businessModules/chat/shared/utils";
import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function UserSidebarHeader({ selfUser }: { selfUser: ApiUser }) {
  const { userPresence, sharePresence } = useGetSelfUserPresence();
  return (
    <Stack
      direction={"row"}
      gap={2}
      alignItems={"center"}
      sx={{
        paddingRight: sidebarPadding,
      }}
    >
      <Badge
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeInset="14%"
        invisible={!sharePresence}
        variant="solid"
        size="md"
        aria-label={`Benutzer (${getPresenseLabel(userPresence)})`}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: getStatusColor(userPresence),
            boxShadow: "0 0 0 1px",
          },
        }}
      >
        <UserAvatar user={selfUser} size={"lg"} />
      </Badge>
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
