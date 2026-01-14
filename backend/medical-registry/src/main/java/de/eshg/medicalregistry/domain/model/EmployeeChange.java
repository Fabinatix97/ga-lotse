/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public non-sealed class EmployeeChange extends AbstractEmployee {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private EmployeeChangeType employeeChangeType;

  public EmployeeChangeType getEmployeeChangeType() {
    return employeeChangeType;
  }

  public void setEmployeeChangeType(EmployeeChangeType employeeChangeType) {
    this.employeeChangeType = employeeChangeType;
  }
}
