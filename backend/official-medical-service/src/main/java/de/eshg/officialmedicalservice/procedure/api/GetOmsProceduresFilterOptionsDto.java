/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;

@Schema(name = "GetOmsProceduresFilterOptions")
public record GetOmsProceduresFilterOptionsDto(
    Boolean assigned, Set<ProcedureStatusDto> status, Boolean highPriority, Boolean today) {}
