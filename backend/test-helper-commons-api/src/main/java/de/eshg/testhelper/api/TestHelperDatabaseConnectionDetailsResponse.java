/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.api;

import jakarta.validation.constraints.NotBlank;

public record TestHelperDatabaseConnectionDetailsResponse(
    @NotBlank String jdbcUrl, @NotBlank String username, @NotBlank String password) {}
