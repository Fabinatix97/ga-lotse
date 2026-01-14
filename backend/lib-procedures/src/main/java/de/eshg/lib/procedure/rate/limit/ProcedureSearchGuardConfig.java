/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConditionalOnProperty(
    prefix = ProcedureSearchGuardProperties.PREFIX,
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true)
public class ProcedureSearchGuardConfig implements WebMvcConfigurer {
  private static final Logger log = LoggerFactory.getLogger(ProcedureSearchGuardConfig.class);

  private ModuleProcedureSearchGuardInterceptor moduleProcedureSearchGuardInterceptor;

  public ProcedureSearchGuardConfig(
      ModuleProcedureSearchGuardInterceptor moduleProcedureSearchGuardInterceptor) {
    this.moduleProcedureSearchGuardInterceptor = moduleProcedureSearchGuardInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    log.info(
        "Rate limiting {} {}",
        moduleProcedureSearchGuardInterceptor.getMethod(),
        moduleProcedureSearchGuardInterceptor.getApiPath());

    registry
        .addInterceptor(moduleProcedureSearchGuardInterceptor)
        .addPathPatterns(moduleProcedureSearchGuardInterceptor.getApiPath());
  }
}
