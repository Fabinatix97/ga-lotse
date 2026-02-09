/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildName, ApiGroupForTransition } from "@eshg/dental-api";

export interface GroupsForTransition {
  readonly id: string;
  readonly groupName?: string;
  readonly children: ApiChildName[];
}

export const NO_GROUP = "no-group-8eb01zwp";

export function mapGroupResult(
  response: ApiGroupForTransition,
): GroupsForTransition {
  return {
    id: response.groupName ?? NO_GROUP,
    groupName: response.groupName,
    children: response.children,
  };
}
