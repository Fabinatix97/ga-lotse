/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class WaitingRoom extends GenericEntity<Long> {
  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  private String description;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private WaitingStatus status;

  @Override
  public Long getId() {
    return id;
  }

  public WaitingStatus getStatus() {
    return status;
  }

  public void setStatus(WaitingStatus status) {
    this.status = status;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public SchoolEntryProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(SchoolEntryProcedure procedure) {
    this.procedure = procedure;
  }
}
