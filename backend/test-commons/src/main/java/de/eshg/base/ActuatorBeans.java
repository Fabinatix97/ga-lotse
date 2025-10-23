/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import org.springframework.boot.actuate.endpoint.web.PathMappedEndpoints;
import org.springframework.boot.actuate.endpoint.web.WebEndpointsSupplier;
import org.springframework.boot.actuate.health.HealthEndpointGroups;

public record ActuatorBeans(
    WebEndpointsSupplier webEndpointsSupplier,
    HealthEndpointGroups healthEndpointGroups,
    PathMappedEndpoints pathMappedEndpoints) {}
