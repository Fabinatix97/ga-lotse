/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record MedicalRegistryProcedurePopulationResponse(
    List<UUID> procedures, @NotNull long count) {}
