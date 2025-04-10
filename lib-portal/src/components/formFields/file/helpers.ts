/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatFileSize(bytes: number) {
  const kilo = 1024;
  const mega = 1024 * 1024;
  if (bytes < mega) return `${(bytes / kilo).toFixed(1)} KB`;
  return `${(bytes / mega).toFixed(1)} MB`;
}
