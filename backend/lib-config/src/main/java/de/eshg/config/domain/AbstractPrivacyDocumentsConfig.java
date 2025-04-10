/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;

@MappedSuperclass
@DataSensitivity(SensitivityLevel.PUBLIC)
public class AbstractPrivacyDocumentsConfig extends BaseEntity {
  public static final String PRIVACY_NOTICE = "privacyNotice";
  public static final String PRIVACY_POLICY = "privacyPolicy";

  @OneToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(nullable = false)
  private PrivacyDocument privacyNotice;

  @OneToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(nullable = false)
  private PrivacyDocument privacyPolicy;

  public PrivacyDocument getPrivacyNotice() {
    return privacyNotice;
  }

  public void setPrivacyNotice(PrivacyDocument privacyNotice) {
    this.privacyNotice = privacyNotice;
  }

  public PrivacyDocument getPrivacyPolicy() {
    return privacyPolicy;
  }

  public void setPrivacyPolicy(PrivacyDocument privacyPolicy) {
    this.privacyPolicy = privacyPolicy;
  }
}
