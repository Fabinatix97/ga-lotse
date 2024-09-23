/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
public class StiProtectionProcedure
    extends Procedure<StiProtectionProcedure, StiProtectionTask, Person, Facility> {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private Concern concern;

  @Transient
  public Person getPerson() {
    Assert.isTrue(getRelatedPersons().size() == 1, "There should be exactly one related person");
    return getRelatedPersons().getFirst();
  }

  public Concern getConcern() {
    return concern;
  }

  public void setConcern(Concern concern) {
    this.concern = concern;
  }
}
