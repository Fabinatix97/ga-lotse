/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.LastModifiedDate;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class FluoridationConsent {
  @LastModifiedDate
  @Column(nullable = false)
  private Instant modifiedAt;

  @Column(nullable = false)
  private LocalDate dateOfConsent;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private BooleanWithUnknown consented;

  private Boolean hasAllergy;

  public LocalDate getDateOfConsent() {
    return dateOfConsent;
  }

  public void setDateOfConsent(LocalDate dateOfConsent) {
    this.dateOfConsent = dateOfConsent;
  }

  public BooleanWithUnknown getConsented() {
    return consented;
  }

  public void setConsented(BooleanWithUnknown consented) {
    this.consented = consented;
  }

  public Boolean hasAllergy() {
    return hasAllergy;
  }

  public void setHasAllergy(Boolean hasAllergy) {
    this.hasAllergy = hasAllergy;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }
}
