/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import de.eshg.config.api.GetConfigurationStatusResponse;
import de.eshg.config.mapper.ConfigurationStatusMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnBean(ConfigStatusService.class)
@RequestMapping(ConfigStatusController.BASE_URL)
@Tag(name = "ConfigStatus")
public class ConfigStatusController {

  public static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API;
  private final ConfigStatusService configStatusService;

  ConfigStatusController(ConfigStatusService configStatusService) {
    this.configStatusService = configStatusService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetConfigurationStatusResponse getConfiguration() {
    return ConfigurationStatusMapper.mapToDto(configStatusService.getConfiguration());
  }
}
