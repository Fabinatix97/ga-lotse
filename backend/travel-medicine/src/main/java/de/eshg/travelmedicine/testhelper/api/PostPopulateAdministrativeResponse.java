/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

/**
 * Each Map<String,UUID> consists of pairs of named entities. The entity is created through the call
 * and represented by its UUID. The name is chosen and assigned to the entity.
 */
public record PostPopulateAdministrativeResponse(
    @Valid @NotNull Map<String, UUID> diseasesCreated,
    @Valid @NotNull Map<String, UUID> inventoryVaccinesCreated,
    @Valid @NotNull Map<String, UUID> vaccinesCreated,
    @Valid @NotNull Map<String, UUID> otherServiceTemplatesCreated,
    @Valid @NotNull Map<String, UUID> appointmentBlockGroupsCreated,
    @Valid @NotNull Map<String, UUID> informationStatementTemplatesCreated) {}
