/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateInboxProcedureRequest(
    @CanBeLogged ProcedureTypeDto inboxProcedureType,
    @Valid @NotNull CreateInboxProgressEntryDto inboxProgressEntry,
    @Valid @NotNull ContactDetailsDto contactDetails) {}
