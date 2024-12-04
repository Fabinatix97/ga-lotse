/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisSessionDetails } from "@eshg/employee-portal-api/dental";

import {
  ProphylaxisSession,
  mapProphylaxisSession,
} from "@/lib/businessModules/dental/api/models/ProphylaxisSession";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProphylaxisSessionDetails extends ProphylaxisSession {}

export function mapProphylaxisSessionDetails(
  response: ApiProphylaxisSessionDetails,
) {
  return {
    ...mapProphylaxisSession(response),
  };
}
