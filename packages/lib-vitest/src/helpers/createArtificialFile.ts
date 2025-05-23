/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function createArtificialFile(fileName: string, size?: number) {
  const blob = new Blob([size ? " ".repeat(size) : ""]);
  return new File([blob], fileName);
}
