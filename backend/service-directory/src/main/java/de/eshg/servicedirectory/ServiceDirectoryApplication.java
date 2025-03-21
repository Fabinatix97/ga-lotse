/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import de.eshg.servicedirectory.properties.SdProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(SdProperties.class)
public class ServiceDirectoryApplication {

  public static void main(String[] args) {
    SpringApplication.run(ServiceDirectoryApplication.class, args);
  }
}
