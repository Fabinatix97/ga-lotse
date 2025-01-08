/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEncryptedSymmetricKeyResponse(
    @NotNull @NotEmpty List<Byte> encapsulatedKey,
    @NotNull @NotEmpty List<Byte> encryptedSymmetricKey) {}
