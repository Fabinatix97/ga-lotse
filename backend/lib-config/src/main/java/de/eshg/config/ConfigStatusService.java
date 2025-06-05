/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBean(EshgConfigurationService.class)
@ConditionalOnMissingBean(AbstractConfigStatusService.class)
public class ConfigStatusService extends AbstractConfigStatusService {

  ConfigStatusService(List<ConfigurationStatusAware> configurationStatusAwares) {
    super(configurationStatusAwares);
  }
}
