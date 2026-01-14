/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildName, ApiGroupForTransition } from "@eshg/dental-api";

export interface GroupsForTransition {
  readonly id: string;
  readonly groupName: string;
  readonly children: ApiChildName[];
}

export function mapGroupResult(
  response: ApiGroupForTransition,
): GroupsForTransition {
  return {
    id: response.groupName,
    groupName: response.groupName,
    children: response.children,
  };
}
