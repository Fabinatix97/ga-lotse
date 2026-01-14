/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.CLOSED_AT_DAY;
import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.DEFAULT_ARCHIVING_RELEVANCE;
import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.PROCEDURE_TYPE;

import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import java.util.Set;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetArchivableProceduresFilterOptions(
    @BindParam(PROCEDURE_TYPE)
        @Parameter(
            description =
                """
        Filter logic:
        - If `procedureType` is submitted, only procedures are returned which have one of the submitted types.
        - If not submitted, no filtering takes place
        """)
        Set<ProcedureTypeDto> procedureType,
    @Parameter(
            description =
                """
            Filter logic:
            - If `closedAtDay` is set, only procedures are returned which were closed at that date
            - If not submitted, no filtering takes place
            """)
        @BindParam(CLOSED_AT_DAY)
        LocalDate closedAtDay,
    @BindParam(DEFAULT_ARCHIVING_RELEVANCE)
        @Parameter(
            description =
                """
    Filter logic:
    - If `defaultArchivingRelevance` is submitted, only procedures are returned which have one of the submitted default archiving relevances.
    - If not submitted, no filtering takes place
    """)
        Set<ArchivingRelevanceDto> defaultArchivingRelevance) {}
