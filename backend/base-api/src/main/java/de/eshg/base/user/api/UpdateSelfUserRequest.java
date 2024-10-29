/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.base.SalutationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateSelfUserRequest(
    @Schema(description = "The phone number of a user", example = "+491234567890")
        @Pattern(regexp = "[-+0-9() ]{1,23}")
        String phoneNumber,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat)",
            example = "@username:server")
        @Pattern(regexp = "\\p{ASCII}{3,255}")
        String externalChatUsername,
    @Schema(description = "The academic title of a user", example = "Prof. Dr.")
        @Size(min = 1, max = 119)
        String title,
    @Schema(description = "The salutation of a user", example = "NOT_SPECIFIED")
        SalutationDto salutation) {}
