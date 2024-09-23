/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.time.LocalDate;
import java.util.Collection;

public record EventFilterConfig(
    String userId,
    String clientId,
    Collection<KeycloakEventType> types,
    LocalDate dateFrom,
    LocalDate dateTo,
    Integer first,
    Integer maxResults) {}
