/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.auditlog.AuditLogApi.QueryParameter.END_DATE;
import static de.eshg.auditlog.AuditLogApi.QueryParameter.SOURCE;
import static de.eshg.auditlog.AuditLogApi.QueryParameter.START_DATE;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import java.util.Set;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetAvailableAuditLogsFilterOptions(
    @CanBeLogged
        @BindParam(SOURCE)
        @Parameter(
            description =
                """
        Filter logic:
            - If `source` is submitted, only audit logs from the specified sources are returned.
            - If not submitted, no filtering takes place
        """)
        Set<AuditLogSource> source,
    @CanBeLogged
        @BindParam(START_DATE)
        @Parameter(
            description =
                """
            Can only be used in combination with endDate.

            Filter logic:
            - If `startDate` and `endDate` are submitted, only audit logs within the specified period are returned.
            - If not submitted, no filtering takes place
            """)
        @Past
        LocalDate startDate,
    @CanBeLogged
        @BindParam(END_DATE)
        @Parameter(
            description =
                """
            Can only be used in combination with startDate.

            Filter logic:
            - If `startDate` and `endDate` are submitted, only audit logs within the specified period are returned.
            - If not submitted, no filtering takes place
            """)
        @Past
        LocalDate endDate) {}
