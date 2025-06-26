/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.constraints.NotNull;

public record MedicalRegistryProcedurePopulationRequest(@NotNull int numberOfEntitiesToPopulate) {}
