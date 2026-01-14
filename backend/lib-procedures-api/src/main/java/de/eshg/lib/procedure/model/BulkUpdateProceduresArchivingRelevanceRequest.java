/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import java.util.UUID;

public record BulkUpdateProceduresArchivingRelevanceRequest(
    @NotNull @Size(min = 1, max = 200) Set<UUID> procedures,
    @NotNull ArchivingRelevanceDto archivingRelevance) {}
