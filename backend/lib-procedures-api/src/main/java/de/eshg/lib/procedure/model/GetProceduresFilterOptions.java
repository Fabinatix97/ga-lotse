/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.ASSIGNED_TO_ID;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_STATUS;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_TYPE;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.Set;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetProceduresFilterOptions(
    @Parameter(
            description =
                """
            Only procedures are returned where the assigneeId of at least one task equals the `assignedToId`.
            If not submitted, no filtering takes place.
            """)
        @BindParam(ASSIGNED_TO_ID)
        UUID assignedToId,
    @BindParam(PROCEDURE_TYPE)
        @Parameter(
            description =
                """
        Filter logic:
        - If `procedureType` is submitted, only procedures are returned which have one of the submitted types.
        - If not submitted, no filtering takes place
        """)
        Set<ProcedureTypeDto> procedureType,
    @BindParam(PROCEDURE_STATUS)
        @Parameter(
            description =
                """
            Filter logic:
            - If `procedureStatus` is submitted, only procedures are returned which have one of the submitted statuses.
            - If not submitted, no filtering takes place
            """)
        Set<ProcedureStatusDto> procedureStatus) {}
