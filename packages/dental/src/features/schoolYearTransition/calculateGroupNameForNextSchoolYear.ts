/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function calculateGroupNameForNextSchoolYear(groupName: string) {
  const digits = groupName.replace(/\D/g, "");
  if (digits.length !== 1) {
    return "";
  }

  return groupName.replace(digits, String(+digits + 1));
}
