/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

public record GetValidAuditLogGranteesRequest(
    @NotNull AuditLogSource source, @NotNull @Past LocalDate date) {}
