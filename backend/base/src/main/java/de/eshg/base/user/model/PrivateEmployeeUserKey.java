/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.model;

import java.util.List;

public record PrivateEmployeeUserKey(
    List<Byte> encryptedPrivateKey, int cryptoVersion, String keyIdentifier) {}
