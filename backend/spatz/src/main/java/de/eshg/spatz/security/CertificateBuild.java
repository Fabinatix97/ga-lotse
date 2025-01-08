/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import static de.eshg.servicedirectory.util.X509Utils.LINE_SEPARATOR;

import java.security.KeyPair;
import java.security.cert.X509Certificate;

public record CertificateBuild(
    KeyPair keyPair, X509Certificate certificate, String pemCrt, CertificateBuild signedBy) {

  public String fullChainPem() {
    CertificateBuild c = this;
    StringBuilder s = new StringBuilder();

    while (c != null) {
      s.append(c.pemCrt).append(LINE_SEPARATOR);
      c = c.signedBy;
    }
    return s.toString();
  }
}
