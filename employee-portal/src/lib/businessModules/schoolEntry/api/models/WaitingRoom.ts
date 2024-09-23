/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiWaitingRoom,
  ApiWaitingStatus,
} from "@eshg/employee-portal-api/schoolEntry";

import {
  Versioned,
  mapVersioned,
} from "@/lib/businessModules/schoolEntry/api/models/Versioned";

export interface WaitingRoom extends Versioned {
  description?: string;
  status?: ApiWaitingStatus;
}

export function mapWaitingRoom(response: ApiWaitingRoom): WaitingRoom {
  return {
    ...mapVersioned(response),
    description: response.description,
    status: response.status,
  };
}
