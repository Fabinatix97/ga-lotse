/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.auditlog")
public class AuditLogServiceConfig {
  @NotNull private Path logStorageDir;
  @NotNull @Positive private int retentionPeriodDays = 90;
  @NotNull @Positive private int accessGrantValidityDays = 1;

  public Path getLogStorageDir() {
    return logStorageDir;
  }

  public void setLogStorageDir(Path logStorageDir) {
    if (Files.exists(logStorageDir)) {
      Assert.isTrue(
          Files.isDirectory(logStorageDir), "log storage dir must be a directory:" + logStorageDir);
      Assert.isTrue(
          Files.isWritable(logStorageDir), "log storage dir must be writable:" + logStorageDir);
    }
    this.logStorageDir = logStorageDir;
  }

  public int getRetentionPeriodDays() {
    return retentionPeriodDays;
  }

  public void setRetentionPeriodDays(int retentionPeriodDays) {
    this.retentionPeriodDays = retentionPeriodDays;
  }

  public int getAccessGrantValidityDays() {
    return accessGrantValidityDays;
  }

  public void setAccessGrantValidityDays(int accessGrantValidityDays) {
    this.accessGrantValidityDays = accessGrantValidityDays;
  }
}
