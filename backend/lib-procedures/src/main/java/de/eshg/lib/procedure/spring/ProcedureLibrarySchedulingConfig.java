/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.spring;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class ProcedureLibrarySchedulingConfig {
  @Configuration
  @ConditionalOnTestHelperEnabled
  @PropertySource("classpath:/lib-procedure-test-helper.properties")
  static class AuditLogTestHelperConfiguration {}
}
