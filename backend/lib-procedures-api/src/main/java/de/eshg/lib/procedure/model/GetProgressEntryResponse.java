/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetProgressEntryResponse(
    @NotNull @Valid ProgressEntryDto progressEntry,
    @NotNull @Valid List<KeyDocumentAwareProgressEntryDto> relatedKeyDocumentProgressEntries,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
