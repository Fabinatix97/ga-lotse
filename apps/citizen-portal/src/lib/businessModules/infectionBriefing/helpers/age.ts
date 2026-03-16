/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function isAtLeastSixteenYearsOld(
  dateOfBirth: string | Date,
  appointmentStart: Date | undefined,
): boolean {
  const birthDate = new Date(dateOfBirth);
  const today = new Date(appointmentStart!);

  birthDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 16;
}
