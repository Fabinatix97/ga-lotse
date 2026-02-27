/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static de.eshg.rest.service.security.config.BaseUrls.FileJockey.FILE_IO_API;
import static org.springframework.http.HttpMethod.GET;

import org.springframework.stereotype.Component;

@Component
public class FileJockeyPublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  FileJockeyPublicSecurityConfig() {
    super("file-jockey");
    configureFileIoEndpoints();
  }

  private void configureFileIoEndpoints() {
    requestMatchers(GET, FILE_IO_API + "/**").permitAll();
  }
}
