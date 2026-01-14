/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(
    name = "PublicEmployeeUserKey",
    description =
"""
Contains the details on the public key of a user, used for encrypting the symmetric key which is used for encrypting the audit log files
""")
public record PublicEmployeeUserKeyDto(
    @Schema(description = "The id of the user") @NotNull UUID userId,
    @Schema(description = "The public key") @NotEmpty List<Byte> publicKey,
    @NotNull int cryptoVersion,
    @NotNull String keyIdentifier)
    implements EmployeeUserKeysInfo {}
