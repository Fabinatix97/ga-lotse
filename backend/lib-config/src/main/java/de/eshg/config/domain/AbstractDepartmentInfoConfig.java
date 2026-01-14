/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToOne;

@MappedSuperclass
public abstract class AbstractDepartmentInfoConfig extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true)
  protected DepartmentInfo departmentInfo;

  public DepartmentInfo getDepartmentInfo() {
    return departmentInfo;
  }

  public void setDepartmentInfo(DepartmentInfo departmentInfo) {
    this.departmentInfo = departmentInfo;
  }
}
