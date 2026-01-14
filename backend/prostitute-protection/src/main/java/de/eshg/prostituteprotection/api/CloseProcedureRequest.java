/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.constraints.NotNull;

public record CloseProcedureRequest(@NotNull long version) {}
