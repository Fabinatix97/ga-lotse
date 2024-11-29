/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat;

import de.eshg.rest.service.security.config.ChatManagementPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ConfigurationPropertiesScan
@Import(ChatManagementPublicSecurityConfig.class)
public class ChatManagementApplication {

  public static void main(String[] args) {
    SpringApplication.run(ChatManagementApplication.class, args);
  }
}
