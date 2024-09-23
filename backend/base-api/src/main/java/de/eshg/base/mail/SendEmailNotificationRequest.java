/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SendEmailNotificationRequest(
    @Schema(
            description = "The id of the user who is the addressee of the mail notification.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(
            description =
                "The notification text that is embedded in the notification email template.",
            example = "Löschanfrage")
        @NotBlank
        String notificationMessage) {}
