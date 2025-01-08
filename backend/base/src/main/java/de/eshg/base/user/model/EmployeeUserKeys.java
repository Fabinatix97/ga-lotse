/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.model;

import java.util.List;

public record EmployeeUserKeys(
    List<Byte> encryptedPrivateKey,
    List<Byte> publicKey,
    int cryptoVersion,
    String keyIdentifier) {}
