/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function isValidURL(value: string) {
  try {
    const url = new URL(value);
    const { hostname } = url;
    if (hostname === "" || hostname.startsWith(".") || value.includes("..")) {
      return false;
    }

    return value.startsWith("http://") || value.startsWith("https://");
  } catch {
    return false;
  }
}
