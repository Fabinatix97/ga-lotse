/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

public enum DocumentType {
  IDENTIFICATION_CARD("Personalausweis"),
  PASSPORT("Reisepass");

  private final String description;

  DocumentType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
