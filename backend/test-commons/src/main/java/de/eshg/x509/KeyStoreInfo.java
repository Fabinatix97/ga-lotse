/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.x509;

import java.nio.file.Path;
import java.security.PrivateKey;

public record KeyStoreInfo(
    Path path,
    String cert,
    PrivateKey privateKey,
    java.security.KeyStore keyStore,
    java.security.cert.Certificate certificate) {}
