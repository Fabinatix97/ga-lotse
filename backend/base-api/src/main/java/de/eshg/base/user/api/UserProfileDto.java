/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.base.SalutationDto;
import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "UserProfile")
public record UserProfileDto(
    @Valid @NotNull UserDto user,
    @Schema(description = "Shows if user profile belongs to the user which is currently active")
        @NotNull
        boolean isSelf,
    @Schema(description = "The academic title of a user", example = "Prof. Dr.")
        @Size(min = 1, max = 119)
        String title,
    @Schema(description = "The salutation of a user", example = "NOT_SPECIFIED")
        SalutationDto salutation,
    @Valid @NotNull List<UserGroupDto> groups,
    @Valid @NotNull List<DetailedEventWithoutCalendarId> calendarEvents) {}
