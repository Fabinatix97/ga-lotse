/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import de.eshg.config.api.GetConfigurationStatusResponse;
import de.eshg.config.mapper.ConfigurationStatusMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

public class AbstractConfigStatusController {
  protected final AbstractConfigStatusService configStatusService;

  public AbstractConfigStatusController(AbstractConfigStatusService configStatusService) {
    this.configStatusService = configStatusService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetConfigurationStatusResponse getConfiguration() {
    return ConfigurationStatusMapper.mapToDto(configStatusService.getConfiguration());
  }
}
