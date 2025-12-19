/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record PostPopulateAdministrativeResponse(
    @Valid @NotNull Map<String, UUID> appointmentBlockGroupsCreated,
    @Valid @NotNull Map<String, UUID> physiciansCreated) {}
