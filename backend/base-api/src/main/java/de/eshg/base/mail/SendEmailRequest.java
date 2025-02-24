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
            description =
                "The content of the email. If the type is HTML, this should be an HTML fragment; otherwise, it should be plain text.",
            example =
                "PLAIN_TEXT: 'Dear John Doe,\nthis a test.\nBest regards,\nJane Doe' HTML: 'Dear John Doe,<br>this a test.<br>Best regards,<br>Jane Doe'")
        @NotBlank
        String text,
    @Schema(
            description =
                "The content type of the email. PLAIN_TEXT mails will be sent verbatim. for HTML mails the text will be embedded in a template with a GA specific header and footer.",
            example = "PLAIN_TEXT")
        @NotNull
        MailType type) {}
