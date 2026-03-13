/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.config;

import static de.eshg.rest.service.security.config.BaseUrls.FileJockey.FILE_IO_API;

import de.eshg.filejockey.FileIoRateLimitInterceptor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties(FileJockeyProperties.class)
public class FileJockeyConfig implements WebMvcConfigurer {

  private final FileIoRateLimitInterceptor fileIoRateLimitInterceptor;

  FileJockeyConfig(FileIoRateLimitInterceptor fileIoRateLimitInterceptor) {
    this.fileIoRateLimitInterceptor = fileIoRateLimitInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(fileIoRateLimitInterceptor).addPathPatterns(FILE_IO_API + "/**");
  }
}
