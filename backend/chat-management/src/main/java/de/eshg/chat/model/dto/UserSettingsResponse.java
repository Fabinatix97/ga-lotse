/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.dto;

import jakarta.validation.constraints.NotNull;

public record UserSettingsResponse(
    @NotNull String userId,
    @NotNull boolean chatUsageEnabled,
    @NotNull boolean sharePresence,
    @NotNull boolean showTypingNotification,
    @NotNull boolean chatConsentAsked,
    @NotNull boolean showReadConfirmation,
    @NotNull boolean accountDeactivated,
    @NotNull boolean accountRegistered) {}
