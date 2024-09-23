/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import de.eshg.rest.service.commons.logging.error.ProblemDetailMixin;
import de.eshg.rest.service.commons.logging.filter.MaskingRequestFilter;
import de.eshg.rest.service.commons.logging.filter.MaskingResponseFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ProblemDetail;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@AutoConfiguration
@ConditionalOnProperty(name = "de.eshg.rest.service.masking-enabled", havingValue = "true")
@Import({
  MaskingRequestFilter.class,
  MaskingResponseFilter.class,
  FilteringLogbookAdapter.class,
  WithoutBodyLoggingHandlerInterceptor.class,
  LoggingRequestBodyAdvice.class,
  LoggingResponseBodyAdvice.class,
  LoggingFilter.class
})
@AutoConfigureAfter(WebMvcAutoConfiguration.class)
@PropertySource("classpath:common-logbook-service.properties")
public class RestServiceLoggingAutoConfiguration {

  @Bean
  Jackson2ObjectMapperBuilderCustomizer problemDetailMixinCustomizer() {
    return jacksonObjectMapperBuilder ->
        jacksonObjectMapperBuilder.mixIn(ProblemDetail.class, ProblemDetailMixin.class);
  }

  @Configuration
  static class LoggingInterceptorWebMvcConfigurer implements WebMvcConfigurer {
    private final WithoutBodyLoggingHandlerInterceptor eshgWithoutBodyLoggingHandlerInterceptor;

    LoggingInterceptorWebMvcConfigurer(
        WithoutBodyLoggingHandlerInterceptor eshgWithoutBodyLoggingHandlerInterceptor) {
      this.eshgWithoutBodyLoggingHandlerInterceptor = eshgWithoutBodyLoggingHandlerInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
      registry.addInterceptor(eshgWithoutBodyLoggingHandlerInterceptor);
    }
  }
}
