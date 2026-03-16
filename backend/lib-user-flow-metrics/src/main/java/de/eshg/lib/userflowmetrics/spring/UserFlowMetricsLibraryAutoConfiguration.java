/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import de.eshg.lib.userflowmetrics.UserFlowMetricsController;
import de.eshg.lib.userflowmetrics.UserFlowMetricsHousekeeping;
import de.eshg.lib.userflowmetrics.UserFlowService;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.lib.userflowmetrics.autoconfiguration-enabled",
    havingValue = "true",
    matchIfMissing = true)
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@EnableConfigurationProperties(UserFlowMetricsProperties.class)
@Import({
  UserFlowMetricsHousekeeping.class,
  UserFlowMetricsController.class,
  UserFlowMetricsLibraryInternalSecurityConfig.class,
  UserFlowService.class
})
public class UserFlowMetricsLibraryAutoConfiguration {}
