/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.config;

import de.eshg.rest.service.security.AuthorizationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StatisticsInternalSecurityConfig {
  @Bean
  AuthorizationCustomizer authorizationCustomizer() {
    return auth -> auth.requestMatchers("/simulator/**").authenticated();
  }
}
