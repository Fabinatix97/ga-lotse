/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "SelfUser")
public record SelfUserDto(
    @Schema(description = "The base user object") @NotNull @Valid UserDto user,
    @ArraySchema(arraySchema = @Schema(description = "A list of assigned roles for this user"))
        @NotNull
        List<UserRoleDto> roles) {}
