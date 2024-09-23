/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import jakarta.validation.constraints.NotNull;

public record GetEncryptedSymmetricKeyResponse(
    @NotNull byte[] encapsulatedKey, @NotNull byte[] encryptedSymmetricKey) {}
