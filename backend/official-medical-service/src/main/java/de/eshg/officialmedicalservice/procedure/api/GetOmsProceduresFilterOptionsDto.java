/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;
import java.util.UUID;

@Schema(name = "GetOmsProceduresFilterOptions")
public record GetOmsProceduresFilterOptionsDto(
    Set<UUID> assignedPhysicians,
    Set<ProcedureStatusDto> status,
    Boolean urgentCase,
    /* span format: yyyy-mm-dd<>yyyy-mm-dd, from first, both dates optional, <> separator fix */
    String appointmentDateSpan) {}
