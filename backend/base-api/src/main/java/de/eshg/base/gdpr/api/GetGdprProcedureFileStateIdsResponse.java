/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetGdprProcedureFileStateIdsResponse(
    @NotNull List<UUID> personFileStateIds, @NotNull List<UUID> facilityFileStateIds) {}
