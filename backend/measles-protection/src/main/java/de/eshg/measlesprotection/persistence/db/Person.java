/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class Person extends RelatedPerson<MeaslesProtectionProcedure> {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private RoleStatus roleStatus;

  @Transient
  public boolean isPatient() {
    return PersonType.PATIENT == getPersonType();
  }

  @Transient
  public boolean isCustodian() {
    return PersonType.PARENT == getPersonType();
  }

  public void setRoleStatus(RoleStatus roleStatus) {
    this.roleStatus = roleStatus;
  }

  public RoleStatus getRoleStatus() {
    return roleStatus;
  }
}
