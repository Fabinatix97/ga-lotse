/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import de.eshg.domain.model.BaseEntity;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(
    uniqueConstraints =
        @UniqueConstraint(columnNames = {BaseEntity_.ID, LabTestData.LAB_TEST_TYPE}),
    indexes = @Index(columnList = LabTestData.LAB_TEST_EXAMINATION_ID))
@DiscriminatorColumn(name = LabTestData.LAB_TEST_TYPE)
public abstract class LabTestData extends BaseEntity {

  public static final String LAB_TEST_TYPE = "lab_test_type";
  public static final String LAB_TEST_EXAMINATION_ID = "lab_test_examination_id";

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean result;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String value;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String remark;

  public Boolean getResult() {
    return result;
  }

  public LabTestData() {}

  public LabTestData(Boolean result, String value, String remark) {
    this.result = result;
    this.value = value;
    this.remark = remark;
  }

  public void setResult(Boolean result) {
    this.result = result;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }
}
