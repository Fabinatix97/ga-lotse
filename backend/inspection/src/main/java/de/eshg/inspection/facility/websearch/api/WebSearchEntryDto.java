/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "WebSearchEntry")
public record WebSearchEntryDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull String postalCode,
    @NotNull String city,
    String street,
    @NotNull WebSearchEntryStatusDto status,
    @NotNull boolean ignored,
    String houseNumber,
    String addressAddition,
    String phoneNumber,
    String email,
    UUID facilityId,
    @NotNull List<String> tags) {}
