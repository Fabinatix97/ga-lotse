/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.dto;

import jakarta.validation.constraints.NotNull;

public record UserSettingsResponse(
    @NotNull String userId,
    Boolean chatUsageEnabled,
    Boolean sharePresence,
    Boolean showTypingNotification,
    Boolean chatConsentAsked,
    Boolean showReadConfirmation,
    Boolean accountDeactivated,
    Boolean accountRegistered) {}
