/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.waitingroom;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
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
  private StiProtectionProcedure procedure;

  private String info;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private WaitingStatus status;

  @NotNull @LastModifiedDate private Instant modifiedAt;

  @Override
  public Long getId() {
    return id;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public String getInfo() {
    return info;
  }

  public void setInfo(String info) {
    this.info = info;
  }

  public WaitingStatus getStatus() {
    return status;
  }

  public void setStatus(WaitingStatus status) {
    this.status = status;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
