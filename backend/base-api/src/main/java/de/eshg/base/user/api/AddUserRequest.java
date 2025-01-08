/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.CustomValidations.MandatoryEmailAddressConstraint;
import de.eshg.base.SalutationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(
    description =
        """
        Suggest a user with the given properties.
        The authorization server uses the validators shown in this link:
        https://github.com/keycloak/keycloak/tree/adca2c67673232a6502cac976a10611254cbc51c/services/src/main/java/org/keycloak/userprofile/validator
        """)
public record AddUserRequest(
    @Schema(
            description =
                "The username which is displayed in the application and can be used for the login",
            example = "testuser")
        @NotNull
        @Size(min = 3, max = 255)
        String username,
    @Schema(description = "The email address of a user", example = "example@mail.de")
        @MandatoryEmailAddressConstraint
        String email,
    @Schema(description = "The given name(s) of a user", example = "John")
        @NotNull
        @Size(min = 2, max = 255)
        String firstName,
    @Schema(description = "The last name of a user", example = "Doe")
        @NotNull
        @Size(min = 2, max = 255)
        String lastName,
    @Schema(description = "The academic title of a user", example = "Prof. Dr.") @Size(max = 119)
        String title,
    @Schema(description = "The salutation of a user", example = "NOT_SPECIFIED")
        SalutationDto salutation,
    @Schema(description = "The phone number of a user", example = "+491234567890")
        @Pattern(regexp = "[-+0-9() ]{1,23}")
        String phoneNumber,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat)",
            example = "@username:server")
        @Pattern(regexp = "\\p{ASCII}{3,255}")
        String externalChatUsername,
    @Schema(
            description = "A list of groups the user shall be part of",
            example = "['group1','group2','group3']")
        @NotNull
        List<@NotBlank String> groups) {}
