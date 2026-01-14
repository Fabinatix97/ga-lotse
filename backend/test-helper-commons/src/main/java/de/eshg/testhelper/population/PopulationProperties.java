/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import java.util.Map;
import java.util.Optional;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "eshg.population")
public record PopulationProperties(
    @DefaultValue("true") boolean enabled, Map<String, Integer> defaultNumberOfEntitiesToPopulate) {
  int getDefaultNumberOfEntitiesToPopulate(String entityNameInPropertyKey) {
    return Optional.ofNullable(defaultNumberOfEntitiesToPopulate())
        .map(map -> map.get(entityNameInPropertyKey))
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Failed to get population configuration for entity key '%s'"
                        .formatted(entityNameInPropertyKey)));
  }
}
