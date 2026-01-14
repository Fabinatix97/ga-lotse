/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(
    description =
"""
Contains the details on the encrypted private key from a user, which is necessary for decrypting the symmetric key which is used for decrypting audit log files.
Can be decrypted with the password of the corresponding user.
""")
public record PrivateEmployeeUserKeyDto(
    @Schema(description = "The encrypted private key") @NotEmpty List<Byte> encryptedPrivateKey,
    @NotNull int cryptoVersion,
    @NotBlank String keyIdentifier)
    implements EmployeeUserKeysInfo {}
