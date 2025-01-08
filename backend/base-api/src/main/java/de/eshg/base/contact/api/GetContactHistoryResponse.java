/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetContactHistoryResponse(
    @Valid @NotNull List<ContactHistoryEntryDto> entries,
    @Valid @NotNull Map<UUID, UserDto> resolvedUsers) {}
