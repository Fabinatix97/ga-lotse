/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import java.util.List;

public record GetGroupMembersRequest(List<String> groupNames) {}
