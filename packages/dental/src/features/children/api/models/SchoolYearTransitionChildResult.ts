/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGender } from "@eshg/base-api";
import { ApiChildForTransition } from "@eshg/dental-api";

export interface ChildForTransition {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender?: ApiGender;
  readonly dateOfBirth: Date;
  readonly groupName?: string;
  readonly version: number;
}

export function mapChildForTransitionResult(
  response: ApiChildForTransition,
): ChildForTransition {
  return {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    dateOfBirth: response.dateOfBirth,
    groupName: response.groupName,
    version: response.version,
  };
}
