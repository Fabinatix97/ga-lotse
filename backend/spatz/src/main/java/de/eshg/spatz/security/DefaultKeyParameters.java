/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

public enum DefaultKeyParameters {
  RSA("RSA", 2048),
  ECDSA("EC", 256);

  public final String keyAlgorithm;
  public final int keySize;

  DefaultKeyParameters(String keyAlgorithm, int keySize) {
    this.keyAlgorithm = keyAlgorithm;
    this.keySize = keySize;
  }
}
