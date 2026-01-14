/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.rate.limit;

import de.eshg.base.centralfile.PersonApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConditionalOnProperty(
    prefix = PartialPersonSearchGuardProperties.PREFIX,
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true)
public class PartialPersonSearchGuardConfig implements WebMvcConfigurer {
  private static final Logger log = LoggerFactory.getLogger(PartialPersonSearchGuardConfig.class);

  private PartialPersonSearchGuardInterceptor partialPersonSearchGuardInterceptor;

  public PartialPersonSearchGuardConfig(
      PartialPersonSearchGuardInterceptor partialPersonSearchGuardInterceptor) {
    this.partialPersonSearchGuardInterceptor = partialPersonSearchGuardInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    log.info("Rate limiting partial person search");

    registry
        .addInterceptor(partialPersonSearchGuardInterceptor)
        .addPathPatterns(PersonApi.BASE_URL + PersonApi.PARTIAL_PERSON_SEARCH);
  }
}
