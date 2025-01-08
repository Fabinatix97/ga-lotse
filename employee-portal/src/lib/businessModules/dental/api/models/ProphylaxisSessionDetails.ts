/**
 * Copyright 2025 cronn GmbH
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

export interface ChildResult {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly groupName: string;
}

export interface ProphylaxisSessionDetails extends ProphylaxisSession {
  version: number;
  participants: ChildResult[];
}

function mapChildKeyAttributes(participant: ApiChildResult): ChildResult {
  return {
    ...participant,
  };
}

export function mapProphylaxisSessionDetails(
  response: ApiProphylaxisSessionDetails,
): ProphylaxisSessionDetails {
  return {
    ...mapProphylaxisSession(response),
    participants: response.participants.map(mapChildKeyAttributes),
    version: response.version,
  };
}
