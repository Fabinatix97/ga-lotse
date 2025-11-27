/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.constraints.NotNull;

public record AbortProcedureRequest(@NotNull long version) {}
