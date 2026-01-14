/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
