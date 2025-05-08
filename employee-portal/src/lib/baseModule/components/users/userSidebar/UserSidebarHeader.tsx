/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Badge, DialogTitle, Stack, Typography } from "@mui/joy";

import { ApiUser } from "@eshg/base-api";
import { SIDEBAR_PADDING } from "@eshg/lib-employee-portal";
import { formatUserName } from "@eshg/lib-portal/formatters/person";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { useGetSelfUserPresence } from "@/lib/businessModules/chat/shared/hooks/useGetSelfUserPresence";
import {
  getPresenceLabel,
  getStatusColor,
} from "@/lib/businessModules/chat/shared/utils";

export function UserSidebarHeader({ selfUser }: { selfUser: ApiUser }) {
  const { userPresence, sharePresence } = useGetSelfUserPresence();
  return (
    <Stack
      direction="row"
      gap={2}
      alignItems="center"
      sx={{
        paddingRight: SIDEBAR_PADDING,
      }}
    >
      <Badge
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeInset="14%"
        invisible={!sharePresence}
        variant="solid"
        size="md"
        aria-label={`Benutzer (${getPresenceLabel(userPresence)})`}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: getStatusColor(userPresence),
            boxShadow: "0 0 0 1px",
          },
        }}
      >
        <UserAvatar user={selfUser} size="lg" />
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
        <DialogTitle sx={{ color: "text.primary" }} component="h1" level="h3">
          {formatUserName(selfUser)}
        </DialogTitle>
        <Typography>@{selfUser.username}</Typography>
      </Stack>
    </Stack>
  );
}
