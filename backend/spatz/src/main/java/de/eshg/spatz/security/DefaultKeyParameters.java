/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import de.eshg.servicedirectory.util.X509Utils;

public enum DefaultKeyParameters {
  RSA("RSA", 2048, X509Utils.SIGNATURE_ALGORITHM),
  ECDSA("EC", 256, "SHA384withECDSA");

  public final String keyAlgorithm;
  public final int keySize;
  public final String signingAlgorithm;

  DefaultKeyParameters(String keyAlgorithm, int keySize, String signingAlgorithm) {
    this.keyAlgorithm = keyAlgorithm;
    this.keySize = keySize;
    this.signingAlgorithm = signingAlgorithm;
  }
}
