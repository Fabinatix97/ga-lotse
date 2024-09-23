/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.config;

import jakarta.validation.constraints.NotNull;
import java.nio.file.Files;
import java.nio.file.Path;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.auditlog")
public class AuditLogConfig {

  @NotNull private Path logOutputDir;
  @NotNull @URL private String serviceUrl;

  public Path getLogOutputDir() {
    return logOutputDir;
  }

  public String getServiceUrl() {
    return serviceUrl;
  }

  public void setServiceUrl(String serviceUrl) {
    this.serviceUrl = serviceUrl;
  }

  public void setLogOutputDir(Path logOutputDir) {
    if (Files.exists(logOutputDir)) {
      Assert.isTrue(
          Files.isDirectory(logOutputDir), "log output dir must be a directory:" + logOutputDir);
      Assert.isTrue(
          Files.isWritable(logOutputDir), "log output dir must be writable:" + logOutputDir);
    }
    this.logOutputDir = logOutputDir;
  }
}
