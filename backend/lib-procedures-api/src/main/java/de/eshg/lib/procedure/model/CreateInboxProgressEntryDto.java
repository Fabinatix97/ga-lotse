/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CreateInboxProgressEntry")
public record CreateInboxProgressEntryDto(
    String subject,
    String messageText,
    @NotNull InboxProgressEntryTypeDto inboxProgressEntryType) {}
