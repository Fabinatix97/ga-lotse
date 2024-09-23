/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.spring;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class AuditLogScheduledArchivingConfiguration {

  @Configuration
  @ConditionalOnTestHelperEnabled
  @PropertySource("classpath:/audit-log-test-helper.properties")
  static class TestHelperConfiguration {}
}
