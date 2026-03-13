/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.persistence;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class UserFlow extends BaseEntityWithExternalId {
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private UserFlowType userFlowType;

  @CreatedDate
  @Column(nullable = false)
  private Instant flowStart;

  private Instant flowEnd;

  public UserFlowType getUserFlowType() {
    return userFlowType;
  }

  public void setUserFlowType(UserFlowType userFlowType) {
    this.userFlowType = userFlowType;
  }

  public Instant getFlowStart() {
    return flowStart;
  }

  public Instant getFlowEnd() {
    return flowEnd;
  }

  public void setFlowEnd(Instant flowEnd) {
    this.flowEnd = flowEnd;
  }
}
