/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.config.ConfigStatusService;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.api.ConfigurationStatusDto;
import de.eshg.config.api.GetConfigurationStatusResponse;
import java.util.Map;

public class ConfigurationStatusMapper {
  public static GetConfigurationStatusResponse mapToDto(
      ConfigStatusService.ModuleConfigurationData configuration) {
    return new GetConfigurationStatusResponse(
        mapToDto(configuration.endpointStates()), mapToDto(configuration.moduleState()));
  }

  private static Map<String, ConfigurationStatusDto> mapToDto(
      Map<String, ConfigurationStatus> endpointStates) {
    return endpointStates.entrySet().stream()
        .collect(
            StreamUtil.toLinkedHashMap(Map.Entry::getKey, entry -> mapToDto(entry.getValue())));
  }

  private static ConfigurationStatusDto mapToDto(ConfigurationStatus configurationStatus) {
    return switch (configurationStatus) {
      case COMPLETE -> ConfigurationStatusDto.COMPLETE;
      case PARTIALLY_COMPLETE -> ConfigurationStatusDto.PARTIALLY_COMPLETE;
      case INCOMPLETE -> ConfigurationStatusDto.INCOMPLETE;
    };
  }
}
