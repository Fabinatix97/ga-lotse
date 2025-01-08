/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class CentralFileCleanupServiceConfig {

  @Configuration
  @ConditionalOnTestHelperEnabled
  @PropertySource("classpath:/central-file-deletion-service-test-helper.properties")
  static class AuditLogTestHelperConfiguration {}
}
