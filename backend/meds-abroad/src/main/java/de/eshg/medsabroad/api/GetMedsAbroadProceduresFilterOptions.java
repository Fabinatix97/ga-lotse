/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.web.bind.annotation.BindParam;

public record GetMedsAbroadProceduresFilterOptions(
    @BindParam("creationDate")
        @Parameter(
            description =
                """
                         Filter logic:
                         - If 'creationDate' is submitted, only procedures which were created at the provided date are returned.
                         - If no 'creationDate' is submitted, no filtering takes place.
                         """)
        @PastOrPresent
        LocalDate creationDate,
    @BindParam("procedureStatus")
        @Parameter(
            description =
                """
Filter logic:
- If 'procedureStatus' is submitted, only procedures are returned which have one of the provided types.
- If no 'procedureStatus' is submitted, no filtering takes place.
""")
        Set<ProcedureStatusDto> procedureStatus) {}
