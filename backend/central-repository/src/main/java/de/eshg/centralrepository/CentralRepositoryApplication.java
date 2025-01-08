/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication(exclude = {MultipartAutoConfiguration.class})
@ConfigurationPropertiesScan
public class CentralRepositoryApplication {

  public static void main(String[] args) {
    SpringApplication.run(CentralRepositoryApplication.class, args);
  }
}
