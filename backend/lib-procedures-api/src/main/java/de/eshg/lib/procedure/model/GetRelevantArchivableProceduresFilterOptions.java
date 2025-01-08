/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.CLOSED_AT_DAY;
import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.EXPORTED;

import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetRelevantArchivableProceduresFilterOptions(
    @Parameter(
            description =
                """
            Filter logic:
            - If `closedAtDay` is set, only procedures are returned which were closed at that date
            - If not submitted, no filtering takes place
            """)
        @BindParam(CLOSED_AT_DAY)
        LocalDate closedAtDay,
    @BindParam(EXPORTED)
        @Parameter(
            description =
                """
    Filter logic:
    - If `exported` is true, only procedures are returned which have already been exported.
    - If `exported` is false, only procedures are returned which have not been exported, yet.
    - If not submitted, no filtering takes place
    """)
        Boolean exported) {}
