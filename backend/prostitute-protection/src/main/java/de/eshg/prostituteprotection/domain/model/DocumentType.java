/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

public enum DocumentType {
  IDENTIFICATION_CARD("Personalausweis"),
  PASSPORT("Reisepass"),
  RESIDENCE_PERMIT("Aufenthaltstitel"),
  TOLERANCE_PERMIT("Duldung"),
  OTHER("Sonstige");

  private final String description;

  DocumentType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
