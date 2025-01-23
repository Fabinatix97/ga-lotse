/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.spring.config;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class StatisticsLibrarySchedulingConfig {

  @Configuration
  @ConditionalOnTestHelperEnabled
  @PropertySource("classpath:/lib-statistics-test-helper.properties")
  static class StatisticsTestHelperConfiguration {}
}
