/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterExaminationType(Type examinationType, Boolean postponed) {
  public enum Type {
    REGULAR_EXAMINATION,
    CAN_CHILD,
    ENTRY_LEVEL,
  }
}
