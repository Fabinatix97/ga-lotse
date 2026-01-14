/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "UserChatAttributes")
public record UserChatAttributesDto(
    @Schema(description = "The Id of the user.", example = "fe9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(description = "The given name(s) of a user.", example = "John") @NotNull
        String firstName,
    @Schema(description = "The last name of a user.", example = "Doe") @NotNull String lastName,
    @Schema(
            description =
                "Secret value used as a part of derive key used to encrypt user's local crypto store containing KeyBackup",
            example = "915685ed-b66a-47eb-b6ca-5da7a05ca041")
        String chatCryptoStoreDeriveKeySecret,
    @Schema(
            description = "Matrix User ID (MXID) of the gematik TI-Messenger (matrix chat)",
            example = "@username:matrix_homeserver_url")
        String externalChatUsername) {}
