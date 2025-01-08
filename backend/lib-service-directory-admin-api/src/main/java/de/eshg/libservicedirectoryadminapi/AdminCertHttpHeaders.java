/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi;

import java.util.Locale;

public enum AdminCertHttpHeaders {
  X_ESHG_CLIENT_CERT,
  X_ESHG_CLIENT_CERT_DN;

  public final String headerName;

  AdminCertHttpHeaders() {
    // HTTP headers are case-insensitive, but lowercase in HTTP/2.0 - stick to lowercase and hyphen
    this.headerName = name().toLowerCase(Locale.US).replace('_', '-');
  }
}
