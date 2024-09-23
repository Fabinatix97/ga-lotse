/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InboxProgressEntry")
public record InboxProgressEntryDto(
    @NotNull UUID inboxProgressEntryId,
    String subject,
    String messageText,
    @CanBeLogged @NotNull InboxProgressEntryTypeDto inboxProgressEntryType,
    @Valid ConcreteFileOrFileReference fileReference) {}
