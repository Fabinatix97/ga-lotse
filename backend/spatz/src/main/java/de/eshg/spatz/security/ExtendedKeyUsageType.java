/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import org.bouncycastle.asn1.x509.KeyPurposeId;

public enum ExtendedKeyUsageType {
  SERVER_ONLY(KeyPurposeId.id_kp_serverAuth),
  CLIENT_ONLY(KeyPurposeId.id_kp_clientAuth),
  SERVER_AND_CLIENT(KeyPurposeId.id_kp_serverAuth, KeyPurposeId.id_kp_clientAuth);

  private final KeyPurposeId[] keyPurposeIds;

  ExtendedKeyUsageType(KeyPurposeId... keyPurposeIds) {
    this.keyPurposeIds = keyPurposeIds;
  }

  public KeyPurposeId[] getKeyPurposeIds() {
    return keyPurposeIds;
  }
}
