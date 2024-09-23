/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface Versioned {
  readonly version: number;
}

interface VersionedProps {
  version: number;
}

export function mapVersioned(response: VersionedProps): Versioned {
  return { version: response.version };
}
