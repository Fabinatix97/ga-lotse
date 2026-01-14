/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetUserManagementPageResponse(
    @Valid @NotNull UserDto selfUser,
    @Valid @NotNull List<UserGroupDto> selfGroups,
    @Valid @NotNull List<GroupMemberDto> groupMembers) {}
