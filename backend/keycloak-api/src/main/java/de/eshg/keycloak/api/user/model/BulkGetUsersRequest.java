/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record BulkGetUsersRequest(@NotNull List<@NotNull UUID> userIds, boolean ignoreUnknownId) {}
