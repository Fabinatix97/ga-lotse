/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.esgh.filejockey;

import de.eshg.rest.service.security.config.FileJockeyPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(FileJockeyPublicSecurityConfig.class)
public class FileJockeyApplication {

  public static void main(String[] args) {
    SpringApplication.run(FileJockeyApplication.class, args);
  }
}
