/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
public class UserFlowMetricsLibrarySchedulingConfig {

  @Configuration
  @ConditionalOnTestHelperEnabled
  @PropertySource("classpath:/lib-user-flow-metrics-test-helper.properties")
  static class UserFlowMetricsTestHelperConfiguration {}
}
