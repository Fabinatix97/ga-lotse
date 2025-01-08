/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetAuditLogGrantedAccessesResponse(
    @NotNull @Valid List<GrantedAccessDto> grantedAccesses,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
