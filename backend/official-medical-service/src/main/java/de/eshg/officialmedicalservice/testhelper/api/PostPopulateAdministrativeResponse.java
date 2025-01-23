/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record PostPopulateAdministrativeResponse(
    @Valid @NotNull Map<String, UUID> appointmentBlockGroupsCreated,
    @Valid @NotNull Map<String, UUID> physiciansCreated) {}
