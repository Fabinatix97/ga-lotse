/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
public class MeaslesProtectionConfiguration extends BaseEntity {

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private byte[] privacyNotice;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private byte[] privacyPolicy;

  public byte[] getPrivacyNotice() {
    return privacyNotice;
  }

  public void setPrivacyNotice(byte[] privacyNotice) {
    this.privacyNotice = privacyNotice;
  }

  public byte[] getPrivacyPolicy() {
    return privacyPolicy;
  }

  public void setPrivacyPolicy(byte[] privacyPolicy) {
    this.privacyPolicy = privacyPolicy;
  }
}
