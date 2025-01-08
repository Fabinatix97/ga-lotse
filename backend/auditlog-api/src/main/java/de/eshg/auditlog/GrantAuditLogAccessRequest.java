/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record GrantAuditLogAccessRequest(
    @NotNull AuditLogSource source,
    @NotNull @Past LocalDate date,
    @NotNull @Size(min = 1) Set<UUID> idsOfGrantedUser) {}
