/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import de.eshg.validation.constraints.DateOfBirth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateChildDetailsInBulkRequest(
    @NotNull UUID childId,
    @NotNull long version,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    GenderDto gender,
    String groupName,
    @Valid FluoridationConsentDto fluoridationConsent,
    @NotNull List<UUID> procedureLabels) {}
