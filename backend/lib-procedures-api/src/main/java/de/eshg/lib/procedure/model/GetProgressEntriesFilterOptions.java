/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProgressEntryApi.QueryParameter.*;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.BindParam;

public record GetProgressEntriesFilterOptions(
    @CanBeLogged
        @Parameter(description = "Filter on progressEntryType")
        @BindParam(PROGRESS_ENTRY_TYPE)
        Set<String> progressEntryType,
    @CanBeLogged
        @Parameter(description = "Filter on child class of progressEntry")
        @BindParam(PROGRESS_ENTRY_CLASS)
        Set<ProgressEntryClassDto> progressEntryClass,
    @Parameter(
            description =
                """
                    If `initiatedBy` is set with a `userId` then the following is returned:
                    * Only progressEntries with `createdBy`=`userId` in case `ManualProgressEntry` or `ProcessedInboxProgressEntry`
                    * Only progressEntries with `triggeredBy`=`userId` in case `SystemProgressEntry`
                    """)
        @BindParam(INITIATED_BY)
        Set<UUID> initiatedBy,
    @CanBeLogged
        @Parameter(
            description =
                """
                Filter on triggerType.
                If this is set, only SystemProgressEntries are returned since only SystemProgressEntries have this attribute.
                """)
        @BindParam(TRIGGER_TYPE)
        Set<TriggerTypeDto> triggerType) {}
