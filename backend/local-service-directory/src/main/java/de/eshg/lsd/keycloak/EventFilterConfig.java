/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import java.time.LocalDate;
import java.util.Collection;

public record EventFilterConfig(
    String userId,
    String clientId,
    Collection<LsdKeycloakClient.KeycloakEventType> types,
    LocalDate dateFrom,
    LocalDate dateTo,
    Integer first,
    Integer maxResults) {}
