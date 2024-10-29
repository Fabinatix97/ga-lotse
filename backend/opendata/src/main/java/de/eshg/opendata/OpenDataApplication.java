/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.rest.service.security.config.OpenDataPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@Import(OpenDataPublicSecurityConfig.class)
@EnableConfigurationProperties(VersionProperties.class)
@SpringBootApplication
public class OpenDataApplication {
  public static void main(String[] args) {

    SpringApplication.run(OpenDataApplication.class, args);
  }
}
