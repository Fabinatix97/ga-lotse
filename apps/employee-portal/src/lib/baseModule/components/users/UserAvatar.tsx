/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Avatar } from "@mui/joy";

import { ApiUser } from "@eshg/base-api";

type AvatarSize = "sm" | "lg";

export function UserAvatar({
  user,
  size,
}: {
  user: ApiUser;
  size?: AvatarSize;
}) {
  return (
    <Avatar
      size={size}
      variant="solid"
      color="primary"
      aria-hidden="true"
      sx={{
        "--Avatar-size": size === "lg" ? "5rem" : undefined,
        textTransform: "uppercase",
      }}
    >
      {user.firstName[0]}
      {user.lastName[0]}
    </Avatar>
  );
}
