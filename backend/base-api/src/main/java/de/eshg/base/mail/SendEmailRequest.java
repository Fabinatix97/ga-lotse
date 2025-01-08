/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SendEmailRequest(
    @Schema(
            description = "The email address of the recipient of the email",
            example = "recipient@example.com")
        @NotNull
        @Size(min = 1, max = 254)
        String to,
    @Schema(
            description = "The email address that shall be listed as the sender in the email",
            example = "sender@mail-address.de")
        @Size(min = 1, max = 254)
        String from,
    @Schema(description = "The subject of the email", example = "Important test email") @NotBlank
        String subject,
    @Schema(
            description = "The content of the email. Currently only plain text is possible",
            example = "Dear John Doe, this a test. Best regards, Jane Doe")
        @NotBlank
        String text) {}
