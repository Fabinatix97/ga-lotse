/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.support;

/** Note: All enum constants must have corresponding translations in the frontend. */
public enum MeaslesProtectionSystemProgressEntryType {
  CASE_STATUS_CHANGED,
  PROOF_SUBMITTED,
  MONETARY_FINE_ISSUED,
  ACCESS_RESTRICTION_ISSUED,
  ACCESS_RESTRICTION_UPDATED,
  PROOF_REQUEST_LETTER_SAVED,
  APPOINTMENT_BOOKED,
  APPOINTMENT_REBOOKED,
  APPOINTMENT_DELETED,
}
