/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ImportStatistics {
  created: number;
  duplicated: number;
  failed: number;
  mergeFailed: number;
  merged: number;
  total: number;
}
