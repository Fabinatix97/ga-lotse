/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.statistic.model;

import de.eshg.lib.statistics.util.ConvertibleToValueOptions;

public enum DocumentType implements ConvertibleToValueOptions {
  IDENTIFICATION_CARD("Personalausweis"),
  PASSPORT("Reisepass"),
  RESIDENCE_PERMIT("Aufenthaltstitel"),
  TOLERANCE_PERMIT("Duldung"),
  OTHER("Sonstige");

  private final String value;

  DocumentType(String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }

  @Override
  public String getMeaning() {
    return value;
  }

  public static String convertDocumentTypeToValue(
      de.eshg.prostituteprotection.domain.model.DocumentType type) {
    return switch (type) {
      case null -> null;
      case IDENTIFICATION_CARD -> IDENTIFICATION_CARD.getValue();
      case PASSPORT -> PASSPORT.getValue();
      case RESIDENCE_PERMIT -> RESIDENCE_PERMIT.getValue();
      case TOLERANCE_PERMIT -> TOLERANCE_PERMIT.getValue();
      case OTHER -> OTHER.getValue();
    };
  }
}
