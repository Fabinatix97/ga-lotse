/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class Consultation extends GenericEntity<Long> {
  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private ProstituteProtectionProcedure procedure;

  private boolean legalAdvices;
  private boolean healthAndSocialInsurance;
  private boolean consultingServices;
  private boolean emergencyHelp;
  private boolean taxLiability;
  private boolean clearing;
  private boolean informationMaterial;
  private boolean predicament;
  private boolean diseasePrevention;
  private boolean birthControl;
  private boolean pregnancy;
  private boolean alcoholAndDrugUsage;
  private boolean referral;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Language languageOfConsultation;

  private boolean interpreterConsulted;
  private String interpreterFirstName;
  private String interpreterLastName;

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public boolean isLegalAdvices() {
    return legalAdvices;
  }

  public void setLegalAdvices(boolean legalAdvices) {
    this.legalAdvices = legalAdvices;
  }

  public boolean isHealthAndSocialInsurance() {
    return healthAndSocialInsurance;
  }

  public void setHealthAndSocialInsurance(boolean healthAndSocialInsurance) {
    this.healthAndSocialInsurance = healthAndSocialInsurance;
  }

  public boolean isConsultingServices() {
    return consultingServices;
  }

  public void setConsultingServices(boolean consultingServices) {
    this.consultingServices = consultingServices;
  }

  public boolean isEmergencyHelp() {
    return emergencyHelp;
  }

  public void setEmergencyHelp(boolean emergencyHelp) {
    this.emergencyHelp = emergencyHelp;
  }

  public boolean isTaxLiability() {
    return taxLiability;
  }

  public void setTaxLiability(boolean taxLiability) {
    this.taxLiability = taxLiability;
  }

  public boolean isClearing() {
    return clearing;
  }

  public void setClearing(boolean clearing) {
    this.clearing = clearing;
  }

  public boolean isInformationMaterial() {
    return informationMaterial;
  }

  public void setInformationMaterial(boolean informationMaterial) {
    this.informationMaterial = informationMaterial;
  }

  public boolean isReferral() {
    return referral;
  }

  public void setReferral(boolean referral) {
    this.referral = referral;
  }

  public boolean isAlcoholAndDrugUsage() {
    return alcoholAndDrugUsage;
  }

  public void setAlcoholAndDrugUsage(boolean alcoholAndDrugUsage) {
    this.alcoholAndDrugUsage = alcoholAndDrugUsage;
  }

  public boolean isPregnancy() {
    return pregnancy;
  }

  public void setPregnancy(boolean pregnancy) {
    this.pregnancy = pregnancy;
  }

  public boolean isBirthControl() {
    return birthControl;
  }

  public void setBirthControl(boolean birthControl) {
    this.birthControl = birthControl;
  }

  public boolean isDiseasePrevention() {
    return diseasePrevention;
  }

  public void setDiseasePrevention(boolean diseasePrevention) {
    this.diseasePrevention = diseasePrevention;
  }

  public boolean isPredicament() {
    return predicament;
  }

  public void setPredicament(boolean predicament) {
    this.predicament = predicament;
  }

  public ProstituteProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(ProstituteProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public Language getLanguageOfConsultation() {
    return languageOfConsultation;
  }

  public void setLanguageOfConsultation(Language languageOfConsultation) {
    this.languageOfConsultation = languageOfConsultation;
  }

  public boolean isInterpreterConsulted() {
    return interpreterConsulted;
  }

  public void setInterpreterConsulted(boolean interpreterConsulted) {
    this.interpreterConsulted = interpreterConsulted;
  }

  public String getInterpreterFirstName() {
    return interpreterFirstName;
  }

  public void setInterpreterFirstName(String interpreterName) {
    this.interpreterFirstName = interpreterName;
  }

  public String getInterpreterLastName() {
    return interpreterLastName;
  }

  public void setInterpreterLastName(String interpreterLastName) {
    this.interpreterLastName = interpreterLastName;
  }
}
