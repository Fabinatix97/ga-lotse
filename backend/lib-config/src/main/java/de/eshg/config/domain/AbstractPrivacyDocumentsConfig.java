/*
 * Copyright 2026 cronn GmbH
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
  private MultiLangDocument privacyNotice;

  @OneToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(nullable = false)
  private MultiLangDocument privacyPolicy;

  public MultiLangDocument getPrivacyNotice() {
    return privacyNotice;
  }

  public void setPrivacyNotice(MultiLangDocument privacyNotice) {
    this.privacyNotice = privacyNotice;
  }

  public MultiLangDocument getPrivacyPolicy() {
    return privacyPolicy;
  }

  public void setPrivacyPolicy(MultiLangDocument privacyPolicy) {
    this.privacyPolicy = privacyPolicy;
  }
}
