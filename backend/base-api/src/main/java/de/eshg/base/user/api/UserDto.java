/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.CustomValidations.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "User")
public record UserDto(
    @Schema(description = "The Id of the user.", example = "fe9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(
            description =
                "The username which is displayed in the application and can be used for the login.",
            example = "testuser")
        @NotBlank
        String username,
    @Schema(description = "The email address of a user.", example = "example@mail.de")
        @MandatoryEmailAddressConstraint
        String email,
    @Schema(description = "The phone number of a user.", example = "+491234567890")
        String phoneNumber,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat).",
            example = "@username:server")
        String externalChatUsername,
    @Schema(description = "The given name(s) of a user.", example = "John") @NotNull
        String firstName,
    @Schema(description = "The last name of a user.", example = "Doe") @NotNull String lastName,
    @Schema(description = "True, if the user can login", example = "false") @NotNull
        boolean enabled) {}
