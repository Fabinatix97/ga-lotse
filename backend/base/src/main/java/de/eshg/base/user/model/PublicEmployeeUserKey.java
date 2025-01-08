/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.model;

import java.util.List;
import java.util.UUID;

public record PublicEmployeeUserKey(
    UUID userId, List<Byte> publicKey, int cryptoVersion, String keyIdentifier) {}
