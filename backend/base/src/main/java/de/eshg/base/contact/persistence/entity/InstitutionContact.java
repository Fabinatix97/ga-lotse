/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;

@Entity
@Audited(withModifiedFlag = true)
public class InstitutionContact extends Contact {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InstitutionContactCategory category;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InstitutionContactSubCategory subCategory;

  public InstitutionContactCategory getCategory() {
    return category;
  }

  public void setCategory(InstitutionContactCategory category) {
    this.category = category;
  }

  public InstitutionContactSubCategory getSubCategory() {
    return subCategory;
  }

  public void setSubCategory(InstitutionContactSubCategory subCategory) {
    this.subCategory = subCategory;
  }
}
