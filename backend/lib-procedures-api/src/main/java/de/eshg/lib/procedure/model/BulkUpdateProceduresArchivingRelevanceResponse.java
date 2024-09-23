/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

public record BulkUpdateProceduresArchivingRelevanceResponse(
    @NotNull Set<UUID> updatedProcedures,
    @NotNull Set<UUID> failedProcedures,
    @NotNull ArchivingRelevanceDto archivingRelevance) {}
