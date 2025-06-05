/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateFluoridationConsentBulkRequest(
    @NotNull @PastOrPresent LocalDate dateOfConsent,
    @NotNull boolean consented,
    @NotEmpty List<UUID> childIds) {}
