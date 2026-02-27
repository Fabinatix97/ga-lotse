/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.schoolentry.util.CorrelationIdGenerator;
import java.security.SecureRandom;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class SchoolEntryCorrelationIdConfig {

  @Bean
  @Profile("!test") // We want to use a "stable random" generator with seed in tests
  public CorrelationIdGenerator correlationIdGenerator() {
    return new CorrelationIdGenerator(() -> new SecureRandom()::nextInt);
  }
}
