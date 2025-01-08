/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserFilterParameters(
    @Schema(description = "A filter for a role users can have") UserRoleDto role,
    @Schema(
            description =
                "The start of the first name, last name, username or email of a User which shall be searched for.")
        String searchTerm) {}
