/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

import java.util.Locale;

public enum EshgHttpHeaders {
  X_ESHG_CERT_SAN,
  X_ESHG_CERT_SUBJECT,
  X_ESHG_CERT_TYPE,
  X_ESHG_SENDER_ORGUNIT,
  X_ESHG_TARGET_ORGUNIT;

  public final String headerName;

  EshgHttpHeaders() {
    // HTTP headers are case-insensitive, but lowercase in HTTP/2.0 - stick to lowercase and hyphen
    this.headerName = name().toLowerCase(Locale.US).replace('_', '-');
  }
}
