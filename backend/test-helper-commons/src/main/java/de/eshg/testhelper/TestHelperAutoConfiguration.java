/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.sql.init.SqlInitializationAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationConfigurationCustomizer;
import org.springframework.context.annotation.*;

@AutoConfiguration(
    before = ValidationAutoConfiguration.class,
    after = SqlInitializationAutoConfiguration.class)
@Import({
  DefaultTestHelperService.class,
  TestRequestInterceptor.class,
  PopulateWithAccessTokenHelper.class,
  DatabaseResetHelper.class,
  DatabaseResetAction.class,
  TestHelperClockResetAction.class,
})
@ConditionalOnTestHelperEnabled
public class TestHelperAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(TestHelperAutoConfiguration.class);

  TestHelperAutoConfiguration(EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Test Helper is enabled!");
  }

  @Bean
  @ConditionalOnProperty(value = "eshg.testclock.enabled", havingValue = "true")
  TestHelperClock testHelperClock(EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    TestHelperClock testHelperClock = TestHelperClock.defaultBerlin();
    log.warn("Using {}", testHelperClock.getClass().getSimpleName());
    return testHelperClock;
  }

  @Bean
  ValidationConfigurationCustomizer clockProviderConfigurationCustomizer(Clock clock) {
    return configuration -> configuration.clockProvider(() -> clock);
  }
}
