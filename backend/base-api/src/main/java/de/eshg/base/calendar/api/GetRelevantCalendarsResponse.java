/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetRelevantCalendarsResponse(
    @NotNull @Valid UserCalendar currentUserCalendar,
    @NotNull @Valid List<GlobalCalendar> globalCalendars,
    @NotNull @Valid List<UserGroupCalendarInfo> userGroupCalendarInfos,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
