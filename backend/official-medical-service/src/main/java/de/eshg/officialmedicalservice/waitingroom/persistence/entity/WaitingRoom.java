/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class WaitingRoom extends BaseEntity {

  @MapsId
  @OneToOne(optional = false)
  private OmsProcedure procedure;

  private String info;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private WaitingStatus status;

  @NotNull @LastModifiedDate private Instant modifiedAt;

  public OmsProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(OmsProcedure procedure) {
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
