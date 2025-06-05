/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseEntity,
  Versioned,
  mapBaseEntity,
  mapVersioned,
} from "@eshg/lib-employee-portal";
import {
  ApiWaitingRoom,
  ApiWaitingRoomProcedure,
  ApiWaitingStatus,
} from "@eshg/school-entry-api";

import {
  Person,
  mapPerson,
} from "@/lib/businessModules/schoolEntry/api/models/Person";

export interface WaitingRoom extends Versioned {
  description?: string;
  status?: ApiWaitingStatus;
  modifiedAt?: Date;
}

export function mapWaitingRoom(response: ApiWaitingRoom): WaitingRoom {
  return {
    ...mapVersioned(response),
    description: response.description,
    status: response.status,
  };
}

export interface WaitingRoomProcedure extends BaseEntity {
  readonly child: Person;
  readonly waitingRoom: ApiWaitingRoom;
  readonly modifiedAt: Date;
}

export function mapWaitingRoomProcedure(
  response: ApiWaitingRoomProcedure,
): WaitingRoomProcedure {
  return {
    ...mapBaseEntity(response),
    child: mapPerson(response.child),
    waitingRoom: response.waitingRoom,
    modifiedAt: response.modifiedAt,
  };
}
