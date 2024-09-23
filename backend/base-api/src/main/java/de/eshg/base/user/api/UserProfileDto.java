/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "UserProfile")
public record UserProfileDto(
    @Valid @NotNull UserDto user,
    @Schema(description = "Shows if user profile belongs to the user which is currently active")
        @NotNull
        boolean isSelf,
    @Valid @NotNull List<UserGroupDto> groups,
    @Valid @NotNull List<DetailedEventWithoutCalendarId> calendarEvents) {}
