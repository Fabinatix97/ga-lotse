/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import java.security.PrivateKey;

public record CertKeyPair(String cert, PrivateKey privateKey) {}
