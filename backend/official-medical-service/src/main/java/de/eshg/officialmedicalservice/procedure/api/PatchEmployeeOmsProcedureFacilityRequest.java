/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PatchEmployeeOmsProcedureFacilityRequest(
    @NotNull @Valid FacilityDto updatedFacility) {}
