/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record UpdateSelfUserRequest(
    @Schema(description = "The phone number of a user", example = "+491234567890")
        @Pattern(regexp = "[-+0-9() ]{1,23}")
        String phoneNumber,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat)",
            example = "@username:server")
        @Pattern(regexp = "\\p{ASCII}{3,255}")
        String externalChatUsername) {}
