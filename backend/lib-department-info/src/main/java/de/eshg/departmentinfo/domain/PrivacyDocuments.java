/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.domain;

import static jakarta.persistence.CascadeType.PERSIST;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;

@Entity
public class PrivacyDocuments extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = PERSIST, orphanRemoval = true)
  private Document privacyPolicy;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = PERSIST, orphanRemoval = true)
  private Document privacyNotice;

  public Document getPrivacyPolicy() {
    return privacyPolicy;
  }

  public void setPrivacyPolicy(Document privacyPolicy) {
    this.privacyPolicy = privacyPolicy;
  }

  public Document getPrivacyNotice() {
    return privacyNotice;
  }

  public void setPrivacyNotice(Document privacyNotice) {
    this.privacyNotice = privacyNotice;
  }
}
