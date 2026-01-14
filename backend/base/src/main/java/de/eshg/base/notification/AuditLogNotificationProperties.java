/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification;

import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("eshg.base.auditlog")
public class AuditLogNotificationProperties implements ResettableProperties {
  private @Positive int minimalConfiguredAuditlogKeys = 3;

  public int getMinimalConfiguredAuditlogKeys() {
    return minimalConfiguredAuditlogKeys;
  }

  public void setMinimalConfiguredAuditlogKeys(int minimalConfiguredAuditlogKeys) {
    this.minimalConfiguredAuditlogKeys = minimalConfiguredAuditlogKeys;
  }
}
