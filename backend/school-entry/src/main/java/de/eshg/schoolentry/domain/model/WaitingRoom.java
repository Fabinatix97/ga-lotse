/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class WaitingRoom extends GenericEntity<Long> {
  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  private String description;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private WaitingStatus status;

  @NotNull @LastModifiedDate private Instant modifiedAt;

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

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
