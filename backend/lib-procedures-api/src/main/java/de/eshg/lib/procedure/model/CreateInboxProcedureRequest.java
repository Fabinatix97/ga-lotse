/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateInboxProcedureRequest(
    ProcedureTypeDto inboxProcedureType,
    @Valid @NotNull CreateInboxProgressEntryDto inboxProgressEntry,
    @Valid @NotNull ContactDetailsDto contactDetails) {}
