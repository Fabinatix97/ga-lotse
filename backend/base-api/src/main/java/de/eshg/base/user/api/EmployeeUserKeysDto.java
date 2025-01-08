/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "EmployeeUserKeys")
public record EmployeeUserKeysDto(
    @Schema(description = "The encrypted private key") @NotEmpty List<Byte> encryptedPrivateKey,
    @Schema(description = "The public key corresponding to the encrypted private key") @NotEmpty
        List<Byte> publicKey,
    @NotNull int cryptoVersion,
    @NotBlank String keyIdentifier)
    implements EmployeeUserKeysInfo {}
