/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:/muk/${eshg.muk.profile:disabled}.properties")
public class MukConfig {
  private static final Logger log = LoggerFactory.getLogger(MukConfig.class);

  MukConfig(@Value("${eshg.muk.profile:disabled}") String mukProfile) {
    log.info("Using MUK profile: {}", mukProfile);
  }
}
