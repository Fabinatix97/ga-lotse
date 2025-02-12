/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.Instant;
import java.time.LocalDate;
import org.springframework.data.annotation.LastModifiedDate;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class FluoridationConsent {
  @LastModifiedDate
  @Column(nullable = false)
  private Instant modifiedAt;

  @Column(nullable = false)
  private LocalDate dateOfConsent;

  @Column(nullable = false)
  private boolean consented;

  private Boolean hasAllergy;

  public LocalDate getDateOfConsent() {
    return dateOfConsent;
  }

  public void setDateOfConsent(LocalDate dateOfConsent) {
    this.dateOfConsent = dateOfConsent;
  }

  public boolean isConsented() {
    return consented;
  }

  public void setConsented(boolean consented) {
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
