/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.environment.EnvironmentConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.*;

@AutoConfiguration(after = TestHelperAutoConfiguration.class)
@Import(TestHelperController.class)
@ConditionalOnTestHelperEnabled
// This autoconfiguration is separated from TestHelperAutoConfiguration
// to ensure that the TestHelperController bean is initialized _after_
// the TestHelperService has been created.
public class TestHelperControllerAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(TestHelperAutoConfiguration.class);

  TestHelperControllerAutoConfiguration(EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Applying {}", getClass().getSimpleName());
  }
}
