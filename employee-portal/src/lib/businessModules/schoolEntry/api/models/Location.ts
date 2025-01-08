/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface Location {
  readonly id: string;
  readonly name: string;
}

interface LocationResponse {
  id: string;
  name: string;
}

export function mapLocation(response: LocationResponse): Location {
  return {
    id: response.id,
    name: response.name,
  };
}
