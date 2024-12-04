/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class OmsProcedure extends Procedure<OmsProcedure, OmsTask, Person, Facility> {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CreatedByUserType createdBy;

  public CreatedByUserType getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(CreatedByUserType createdBy) {
    this.createdBy = createdBy;
  }
}
