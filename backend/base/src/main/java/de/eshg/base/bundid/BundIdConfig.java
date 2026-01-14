/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:/bundid/${eshg.bund-id.profile:disabled}.properties")
public class BundIdConfig {
  private static final Logger log = LoggerFactory.getLogger(BundIdConfig.class);

  BundIdConfig(@Value("${eshg.bund-id.profile:disabled}") String bundIdProfile) {
    log.info("Using BundID profile: {}", bundIdProfile);
  }
}
