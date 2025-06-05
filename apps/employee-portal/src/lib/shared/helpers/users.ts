/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUser } from "@eshg/base-api";

export function translateUserGroup(group: string): string {
  if (group.startsWith("[System] ")) {
    return group.substring("[System] ".length);
  }
  return group;
}

export function sortUsersByName(a: ApiUser, b: ApiUser) {
  return [a.lastName, a.firstName]
    .join(" ")
    .localeCompare([b.lastName, b.firstName].join(" "));
}
