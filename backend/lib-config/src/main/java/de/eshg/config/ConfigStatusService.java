/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import de.cronn.commons.lang.StreamUtil;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBean(EshgConfigurationService.class)
public class ConfigStatusService {

  private final List<EshgConfigurationService<?>> configurationServices;

  ConfigStatusService(List<EshgConfigurationService<?>> configurationServices) {
    this.configurationServices = configurationServices;
  }

  ModuleConfigurationData getConfiguration() {
    Map<String, ConfigurationStatus> endpointStates =
        configurationServices.stream()
            .map(EshgConfigurationService::getConfigurationStatus)
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
