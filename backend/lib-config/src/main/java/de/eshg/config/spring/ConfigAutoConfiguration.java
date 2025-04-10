/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.spring;

import de.eshg.config.ConfigStatusController;
import de.eshg.config.ConfigStatusService;
import de.eshg.config.testhelper.EshgConfigurationServiceResetAction;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
  EshgConfigurationServiceResetAction.class,
  ConfigStatusService.class,
  ConfigStatusController.class,
})
public class ConfigAutoConfiguration {}
