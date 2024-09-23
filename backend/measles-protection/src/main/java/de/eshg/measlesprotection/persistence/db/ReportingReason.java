/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

public enum ReportingReason {
  NO_PROOF,
  FIRST_VACCINE,
  MEDICAL_CONTRAINDICATION,
  UNASSESSABLE_PROOF,
  OTHER
}
