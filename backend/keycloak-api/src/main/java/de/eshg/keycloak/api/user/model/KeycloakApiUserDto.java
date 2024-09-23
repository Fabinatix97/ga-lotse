/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record KeycloakApiUserDto(
    @NotNull UUID id,
    @NotNull String username,
    String email,
    String firstName,
    String lastName,
    boolean enabled,
    Map<String, List<String>> attributes) {}
