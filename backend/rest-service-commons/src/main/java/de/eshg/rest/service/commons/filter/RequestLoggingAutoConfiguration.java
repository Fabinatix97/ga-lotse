/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import java.io.Serial;
import java.util.HashSet;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/common-logbook.properties")
@Import({RequestLoggingFilter.class, ActiveRequestCounter.class, ActiveRequestCounterFilter.class})
public class RequestLoggingAutoConfiguration {

  @Bean
  @ConditionalOnMissingBean
  public RequestLoggingPathFilter requestLoggingPathFilter(
      WebEndpointProperties webEndpointProperties) {
    RequestLoggingPathFilter requestLoggingPathFilter = new RequestLoggingPathFilter();
    // Do not log calls to the actuator endpoint
    requestLoggingPathFilter.add(webEndpointProperties.getBasePath() + "/");
    return requestLoggingPathFilter;
  }

  /** Requests with paths starting with these prefixes will not be logged. Note: case-sensitive */
  public static class RequestLoggingPathFilter extends HashSet<String> {
    @Serial private static final long serialVersionUID = 1L;

    boolean matches(String path) {
      return this.stream().anyMatch(path::startsWith);
    }
  }
}
