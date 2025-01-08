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
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class Prevention {

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Set<Vaccination> vaccinations;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SafeSexPractice safeSexPractice;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Set<ProtectionMethod> protectionMethods;

  private Boolean infoAboutPrepDesired;

  public Set<Vaccination> getVaccinations() {
    return vaccinations;
  }

  public void setVaccinations(Set<Vaccination> vaccinations) {
    this.vaccinations = vaccinations;
  }

  public SafeSexPractice getSafeSexPractice() {
    return safeSexPractice;
  }

  public void setSafeSexPractice(SafeSexPractice safeSexPractice) {
    this.safeSexPractice = safeSexPractice;
  }

  public Set<ProtectionMethod> getProtectionMethods() {
    return protectionMethods;
  }

  public void setProtectionMethods(Set<ProtectionMethod> protectionMethods) {
    this.protectionMethods = protectionMethods;
  }

  public Boolean getInfoAboutPrepDesired() {
    return infoAboutPrepDesired;
  }

  public void setInfoAboutPrepDesired(Boolean infoAboutPrepDesired) {
    this.infoAboutPrepDesired = infoAboutPrepDesired;
  }
}
