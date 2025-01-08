/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiUser } from "@eshg/employee-portal-api/base";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { isNonNullish } from "remeda";

import { routes } from "@/lib/baseModule/shared/routes";

import { fullName, unknownUser } from "./userFormatter";

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
      {fullName(user)}
    </InternalLink>
  ) : (
    unknownUser
  );
}
