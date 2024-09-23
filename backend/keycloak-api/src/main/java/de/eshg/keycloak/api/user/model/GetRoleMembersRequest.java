/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

public record GetRoleMembersRequest(String roleName, String searchTerm) {}
