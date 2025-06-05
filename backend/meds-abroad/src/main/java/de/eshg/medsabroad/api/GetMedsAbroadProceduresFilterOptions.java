/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.web.bind.annotation.BindParam;

public record GetMedsAbroadProceduresFilterOptions(
    @Schema(description = "Start of the procedure creation date.")
        @BindParam("creationDateStart")
        @Parameter
        LocalDate creationDateStart,
    @Schema(description = "End of the procedure creation date.")
        @BindParam("creationDateEnd")
        @Parameter
        LocalDate creationDateEnd,
    @BindParam("procedureStatus")
        @Parameter(
            description =
                """
Filter logic:
- If 'procedureStatus' is submitted, only procedures are returned which have one of the provided types.
- If no 'procedureStatus' is submitted, no filtering takes place.
""")
        Set<ProcedureStatusDto> procedureStatus) {}
