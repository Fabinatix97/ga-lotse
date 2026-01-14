/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

public enum CustomHeaders {
  X_SPATZ_OUTBOUND,
  X_SPATZ_INBOUND,
  ;

  public final String kebabName;

  CustomHeaders() {
    this.kebabName = this.name().replace('_', '-');
  }
}
