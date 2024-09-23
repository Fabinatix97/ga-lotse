/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.config;

import de.eshg.base.citizenuser.AccessCodeGenerator;
import java.security.SecureRandom;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class CitizenUserConfig {

  @Bean
  @Profile("!test") // We want to use a "stable random" generator with seed in tests
  public AccessCodeGenerator accessCodeGenerator() {
    return new AccessCodeGenerator(() -> new SecureRandom()::nextInt);
  }
}
