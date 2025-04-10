/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import java.time.LocalDate;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SexWorkRiskContact {

  private LocalDate startInSexWorkDate;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Set<SexWorkLocation> sexWorkLocations;

  public LocalDate getStartInSexWorkDate() {
    return startInSexWorkDate;
  }

  public void setStartInSexWorkDate(LocalDate startInSexWorkDate) {
    this.startInSexWorkDate = startInSexWorkDate;
  }

  public Set<SexWorkLocation> getSexWorkLocations() {
    return sexWorkLocations;
  }

  public void setSexWorkLocations(Set<SexWorkLocation> sexWorkLocations) {
    this.sexWorkLocations = sexWorkLocations;
  }
}
