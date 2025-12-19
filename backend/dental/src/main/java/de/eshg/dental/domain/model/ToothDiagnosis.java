/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SENSITIVE)
public class ToothDiagnosis {
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MainResult mainResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SecondaryResult secondaryResult;

  // flag necessary for hibernate to not ignore empty diagnoses
  @Column(nullable = false)
  private boolean present = true;

  public MainResult mainResult() {
    return mainResult;
  }

  public void setMainResult(MainResult mainResult) {
    this.mainResult = mainResult;
  }

  public SecondaryResult secondaryResult() {
    return secondaryResult;
  }

  public void setSecondaryResult(SecondaryResult secondaryResult) {
    this.secondaryResult = secondaryResult;
  }
}
