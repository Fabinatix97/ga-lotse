/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { isNonNullish } from "remeda";

import { ApiUser } from "@eshg/base-api";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { formatUserName } from "@eshg/lib-portal/formatters/person";

import { routes } from "@/lib/baseModule/shared/routes";

interface UserLinkProps {
  user: ApiUser | undefined;
  nestedLink?: boolean;
}

export function UserLink({ user, nestedLink }: UserLinkProps) {
  return isNonNullish(user) ? (
    <InternalLink
      href={routes.users.details(user.userId)}
      sx={{ zIndex: nestedLink ? 2 : undefined }}
      onClick={(e) => e.stopPropagation()}
    >
      {formatUserName(user)}
    </InternalLink>
  ) : (
    formatUserName(undefined)
  );
}
