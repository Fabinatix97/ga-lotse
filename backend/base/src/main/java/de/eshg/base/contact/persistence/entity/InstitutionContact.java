/*
 * Copyright 2024 cronn GmbH
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

  public InstitutionContactCategory getCategory() {
    return category;
  }

  public void setCategory(InstitutionContactCategory category) {
    this.category = category;
  }
}
