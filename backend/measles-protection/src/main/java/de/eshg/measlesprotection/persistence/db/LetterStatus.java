/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

public enum LetterStatus {
  UPLOADED,
  GENERATED,
  READY_TO_SEND,
  SEND,
  IN_DELIVERY,
  DELIVERED,
  LOST
}
