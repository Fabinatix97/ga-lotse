/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.opendata.config.InitialOpenDataConfiguration;
import de.eshg.opendata.config.OpenDataFeatureToggle;
import de.eshg.rest.service.security.config.OpenDataPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@Import(OpenDataPublicSecurityConfig.class)
@EnableConfigurationProperties({InitialOpenDataConfiguration.class, OpenDataFeatureToggle.class})
@SpringBootApplication
public class OpenDataApplication {
  public static void main(String[] args) {

    SpringApplication.run(OpenDataApplication.class, args);
  }
}
