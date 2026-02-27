/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.eshg.config.domain.Initializable;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class InfectionBriefingConfig extends BaseEntity implements Initializable {

  private boolean initialized = false;

  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
  @JoinColumn(nullable = false)
  private MultiLangDocument landingContent;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public MultiLangDocument getLandingContent() {
    return landingContent;
  }

  public void setLandingContent(MultiLangDocument landingContent) {
    this.landingContent = landingContent;
  }
}
