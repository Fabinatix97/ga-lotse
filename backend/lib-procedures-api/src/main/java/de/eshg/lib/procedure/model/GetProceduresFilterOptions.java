/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.ASSIGNED_TO_ID;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.CREATED_IN_YEAR;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.NOT_ASSIGNED_TO_ID;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.ONCE_ASSIGNED_TO_ID;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_STATUS;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_TYPE;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.UNASSIGNED;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.Year;
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
    @Parameter(
            description =
                """
            Only procedures are returned where the assigneeId of none of the task equals `notAssignedToId`.
            If not submitted, no filtering takes place.
            """)
        @BindParam(NOT_ASSIGNED_TO_ID)
        UUID notAssignedToId,
    @Parameter(
            description =
                """
            Only procedures are returned where the user is or was assigned to at least one task (at least one assigneeId equals `onceAssignedToId` in taskHistory for at least one task).
            If not submitted, no filtering takes place.
            """)
        @BindParam(ONCE_ASSIGNED_TO_ID)
        UUID onceAssignedToId,
    @CanBeLogged
        @Parameter(
            description =
                """
            Filter logic:
            - In case of `true` only procedures are returned where all tasks are unassigned
            - In case of `false` only procedures are returned which have at least one assigned task
            - If not submitted, no filtering takes place
            """)
        @BindParam(UNASSIGNED)
        Boolean unassigned,
    @CanBeLogged
        @BindParam(PROCEDURE_TYPE)
        @Parameter(
            description =
                """
        Filter logic:
        - If `procedureType` is submitted, only procedures are returned which have one of the submitted types.
        - If not submitted, no filtering takes place
        """)
        Set<ProcedureTypeDto> procedureType,
    @CanBeLogged
        @BindParam(PROCEDURE_STATUS)
        @Parameter(
            description =
                """
            Filter logic:
            - If `procedureStatus` is submitted, only procedures are returned which have one of the submitted statuses.
            - If not submitted, no filtering takes place
            """)
        Set<ProcedureStatusDto> procedureStatus,
    @CanBeLogged
        @Parameter(
            description =
                """
            Filter logic:
            - If `createdInYear` is set, only procedures are returned which were created in that year
            - If not submitted, no filtering takes place
            """)
        @BindParam(CREATED_IN_YEAR)
        Year createdInYear) {}
