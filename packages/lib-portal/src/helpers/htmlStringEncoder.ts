/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function encodeReservedHtmlCharacters(auditLogFile: string) {
  return auditLogFile
    .replace(/&/gi, "&amp;")
    .replace(/</gi, "&lt;")
    .replace(/>/gi, "&gt;")
    .replace(/'/gi, "&#39;")
    .replace(/"/gi, "&quot;");
}
