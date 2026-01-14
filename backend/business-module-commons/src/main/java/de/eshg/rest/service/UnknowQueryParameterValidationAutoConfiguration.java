/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service;

import de.eshg.rest.service.validation.UnknownQueryParameterValidator;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.rest.service.unknown-query-parameter-validation-enabled",
    havingValue = "true",
    matchIfMissing = true)
public class UnknowQueryParameterValidationAutoConfiguration implements WebMvcConfigurer {

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new UnknownQueryParameterValidator());
  }
}
