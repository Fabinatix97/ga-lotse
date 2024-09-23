/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Badge, Box } from "@mui/joy";

import { Presence } from "@/lib/businessModules/chat/shared/types";

export interface BadgeAvatarProps extends RequiresChildren {
  status: Presence | undefined;
}

export function BadgeAvatar({ status, children }: Readonly<BadgeAvatarProps>) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Badge
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeInset="18%"
        color={getColor(status)}
        variant="solid"
        size="sm"
        invisible={!status}
      >
        {children}
      </Badge>
    </Box>
  );
}

function getColor(status: Presence | undefined) {
  if (status === undefined) {
    return;
  }
  if (status === "online") {
    return "success";
  }
  if (status === "offline") {
    return "danger";
  }
  if (status === "unavailable") {
    return "neutral";
  }
}
