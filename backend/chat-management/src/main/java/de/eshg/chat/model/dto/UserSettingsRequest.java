/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.dto;

import jakarta.validation.constraints.NotNull;

public record UserSettingsRequest(
    @NotNull String userId,
    Boolean chatConsentAsked,
    Boolean chatUsageEnabled,
    Boolean sharePresence,
    Boolean showReadConfirmation,
    Boolean showTypingNotification,
    Boolean accountDeactivated,
    Boolean accountRegistered) {}
