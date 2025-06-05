/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
@DataSensitivity(SensitivityLevel.PUBLIC)
public class AbstractOpeningHours extends BaseEntity implements Initializable {

  @Column(nullable = false)
  private List<String> de = new ArrayList<>();

  @Column(nullable = false)
  private List<String> en = new ArrayList<>();

  @Column(nullable = false)
  private boolean initialized = true;

  public List<String> getDe() {
    return de;
  }

  public void setDe(List<String> de) {
    this.de = de;
  }

  public List<String> getEn() {
    return en;
  }

  public void setEn(List<String> en) {
    this.en = en;
  }

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }
}
