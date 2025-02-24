/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.spring.config;

import de.eshg.lib.statistics.StatisticsController;
import de.eshg.lib.statistics.StatisticsHousekeeping;
import de.eshg.lib.statistics.StatisticsProcedureReferenceController;
import de.eshg.lib.statistics.StatisticsService;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@EnableConfigurationProperties(StatisticsHousekeepingProperties.class)
@Import({
  StatisticsController.class,
  StatisticsService.class,
  StatisticsLibraryInternalSecurityConfig.class,
  StatisticsProcedureReferenceController.class,
  StatisticsHousekeeping.class,
  StatisticsLibrarySchedulingConfig.class
})
public class StatisticsLibraryAutoConfiguration {}
