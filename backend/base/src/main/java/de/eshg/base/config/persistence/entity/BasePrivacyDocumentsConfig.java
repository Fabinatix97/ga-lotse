/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.persistence.entity;

import de.eshg.config.domain.AbstractPrivacyDocumentsConfig;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class BasePrivacyDocumentsConfig extends AbstractPrivacyDocumentsConfig {

  private boolean privacyNoticeInitialized = false;
  private boolean privacyPolicyInitialized = false;

  public boolean isPrivacyNoticeInitialized() {
    return privacyNoticeInitialized;
  }

  public boolean isPrivacyPolicyInitialized() {
    return privacyPolicyInitialized;
  }

  public void setPrivacyNoticeInitialized(boolean privacyNoticeInitialized) {
    this.privacyNoticeInitialized = privacyNoticeInitialized;
  }

  public void setPrivacyPolicyInitialized(boolean privacyPolicyInitialized) {
    this.privacyPolicyInitialized = privacyPolicyInitialized;
  }
}
