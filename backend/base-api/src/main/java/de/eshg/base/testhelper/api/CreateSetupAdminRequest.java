/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper.api;

import jakarta.validation.constraints.NotBlank;

public record CreateSetupAdminRequest(@NotBlank String username, @NotBlank String emailAddress) {}
