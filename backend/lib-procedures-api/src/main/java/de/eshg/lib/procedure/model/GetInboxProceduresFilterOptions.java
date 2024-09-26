/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.INBOX_PROCEDURE_STATUS;
import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.INBOX_PROCEDURE_TYPE;
import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.INCLUDE_UNTYPED;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.Set;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetInboxProceduresFilterOptions(
    @BindParam(INBOX_PROCEDURE_TYPE)
        @Parameter(
            description =
                """
        Filter logic:
        - If `inboxProcedureType` is submitted, only inbox procedures are returned which have one of the submitted types.
        - If not submitted, no filtering takes place.
        """)
        Set<ProcedureTypeDto> inboxProcedureType,
    @Parameter(
            description =
                """
        Filter logic:
        - If true, inbox procedures which have no type are returned in addition to the types specified by 'inboxProcedureType'.
        - If false or not submitted, inbox procedures which have no type are not returned.
        """)
        @BindParam(INCLUDE_UNTYPED)
        Boolean includeUntyped,
    @BindParam(INBOX_PROCEDURE_STATUS)
        @Parameter(
            description =
                """
            Filter logic:
            - If `inboxProcedureStatus` is submitted, only inbox procedures are returned which have one of the submitted statuses.
            - If not submitted, no filtering takes place.
            """)
        Set<InboxProcedureStatusDto> inboxProcedureStatus) {}
