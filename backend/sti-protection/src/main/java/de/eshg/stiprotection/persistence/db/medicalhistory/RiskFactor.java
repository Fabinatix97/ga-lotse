/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.FetchType;
import java.time.LocalDate;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class RiskFactor {

  @AttributeOverrides({
    @AttributeOverride(name = "hepA", column = @Column(name = "vaccination_hep_a")),
    @AttributeOverride(name = "hepB", column = @Column(name = "vaccination_hep_b")),
    @AttributeOverride(name = "hpv", column = @Column(name = "vaccination_hpv")),
  })
  @Embedded
  private Vaccination vaccinations;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SafeSexPractice safeSexPractice;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Set<ProtectionMethod> protectionMethods;

  @Column(nullable = false)
  private Boolean prepInfoProvided;

  private LocalDate riskActivityDateVaginalIntercourse;

  private LocalDate riskActivityDateOralIntercourse;

  private LocalDate riskActivityDateAnalIntercourse;

  private String otherRiskActivities;

  public Vaccination getVaccinations() {
    return vaccinations;
  }

  public void setVaccinations(Vaccination vaccinations) {
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

  public Boolean getPrepInfoProvided() {
    return prepInfoProvided;
  }

  public void setPrepInfoProvided(Boolean prepInfoProvided) {
    this.prepInfoProvided = prepInfoProvided;
  }

  public LocalDate getRiskActivityDateVaginalIntercourse() {
    return riskActivityDateVaginalIntercourse;
  }

  public void setRiskActivityDateVaginalIntercourse(LocalDate riskActivityDateVaginalIntercourse) {
    this.riskActivityDateVaginalIntercourse = riskActivityDateVaginalIntercourse;
  }

  public LocalDate getRiskActivityDateOralIntercourse() {
    return riskActivityDateOralIntercourse;
  }

  public void setRiskActivityDateOralIntercourse(LocalDate riskActivityDateOralIntercourse) {
    this.riskActivityDateOralIntercourse = riskActivityDateOralIntercourse;
  }

  public LocalDate getRiskActivityDateAnalIntercourse() {
    return riskActivityDateAnalIntercourse;
  }

  public void setRiskActivityDateAnalIntercourse(LocalDate riskActivityDateAnalIntercourse) {
    this.riskActivityDateAnalIntercourse = riskActivityDateAnalIntercourse;
  }

  public String getOtherRiskActivities() {
    return otherRiskActivities;
  }

  public void setOtherRiskActivities(String otherRiskActivities) {
    this.otherRiskActivities = otherRiskActivities;
  }
}
