/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Embeddable
public class RiskActivity {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private RiskActivityType riskActivityType;

  @Column(nullable = false)
  private LocalDate riskActivityDate;

  public RiskActivityType getRiskActivityType() {
    return riskActivityType;
  }

  public void setRiskActivityType(RiskActivityType riskActivityType) {
    this.riskActivityType = riskActivityType;
  }

  public LocalDate getRiskActivityDate() {
    return riskActivityDate;
  }

  public void setRiskActivityDate(LocalDate riskActivityDate) {
    this.riskActivityDate = riskActivityDate;
  }
}
