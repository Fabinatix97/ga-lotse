/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import de.cronn.commons.lang.StreamUtil;
import java.util.*;

public class AbstractConfigStatusService {
  protected final List<ConfigurationStatusAware> configurationStatusAwares;

  public AbstractConfigStatusService(List<ConfigurationStatusAware> configurationStatusAwares) {
    this.configurationStatusAwares = configurationStatusAwares;
  }

  ModuleConfigurationData getConfiguration() {
    Map<String, ConfigurationStatus> endpointStates =
        configurationStatusAwares.stream()
            .map(ConfigurationStatusAware::getConfigurationStatus)
            .map(Map::entrySet)
            .flatMap(Collection::stream)
            .collect(StreamUtil.toLinkedHashMap(Map.Entry::getKey, Map.Entry::getValue));

    return new ModuleConfigurationData(
        endpointStates, getLowestEndpointState(endpointStates.values()));
  }

  private ConfigurationStatus getLowestEndpointState(Collection<ConfigurationStatus> values) {
    Set<ConfigurationStatus> configurationStatuses = new LinkedHashSet<>(values);

    if (configurationStatuses.contains(ConfigurationStatus.INCOMPLETE)) {
      return ConfigurationStatus.INCOMPLETE;
    } else if (configurationStatuses.contains(ConfigurationStatus.PARTIALLY_COMPLETE)) {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
    } else {
      return ConfigurationStatus.COMPLETE;
    }
  }

  public record ModuleConfigurationData(
      Map<String, ConfigurationStatus> endpointStates, ConfigurationStatus moduleState) {}
}
