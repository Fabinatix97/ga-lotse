/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.history.HistoryEntry;
import de.eshg.base.history.HistoryEntryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "ContactHistoryEntry")
public record ContactHistoryEntryDto(
    @NotNull HistoryEntryType type,
    @NotNull long historyId,
    @NotNull UUID modifiedBy,
    @NotNull Instant modifiedAt,
    @Schema(description = "Id of the Contact.", example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID contactId,
    @Valid ContactAddressReference addressReference,
    @NotNull @Valid AbstractContactChange changes)
    implements HistoryEntry {}
