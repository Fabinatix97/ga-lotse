/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.testhelper;

import jakarta.validation.constraints.NotNull;

public record OrgUnitPopulationRequest(
    @NotNull int numberOfEntitiesToPopulate, Boolean generateCertificates) {}
