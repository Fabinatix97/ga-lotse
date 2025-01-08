/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGroupMembersResponse(
    @NotNull @Valid List<KeycloakApiGroupMemberDto> groupMembers) {}
