/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChildResult,
  ApiProphylaxisSessionDetails,
} from "@eshg/employee-portal-api/dental";

import {
  ProphylaxisSession,
  mapProphylaxisSession,
} from "@/lib/businessModules/dental/api/models/ProphylaxisSession";

export interface ChildKeyAttributes {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
}

export interface ProphylaxisSessionDetails extends ProphylaxisSession {
  participants: ChildKeyAttributes[];
}

function mapChildKeyAttributes(
  participants: ApiChildResult,
): ChildKeyAttributes {
  return {
    ...participants,
  };
}

export function mapProphylaxisSessionDetails(
  response: ApiProphylaxisSessionDetails,
) {
  return {
    ...mapProphylaxisSession(response),
    participants: response.participants.map(mapChildKeyAttributes),
  };
}
