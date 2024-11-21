/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class MedicalRegistryEntry
    extends Procedure<MedicalRegistryEntry, MedicalRegistryTask, Professional, Practice> {

  protected MedicalRegistryEntry() {}

  public MedicalRegistryEntry(TriggerType triggerType) {
    super(triggerType);
  }

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean employeesEmployed;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean consentToPrivacyPolicy;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean requestForWrittenConfirmation;

  public boolean isEmployeesEmployed() {
    return employeesEmployed;
  }

  public void setEmployeesEmployed(boolean employeesEmployed) {
    this.employeesEmployed = employeesEmployed;
  }

  public boolean isConsentToPrivacyPolicy() {
    return consentToPrivacyPolicy;
  }

  public void setConsentToPrivacyPolicy(boolean consentToPrivacyPolicy) {
    this.consentToPrivacyPolicy = consentToPrivacyPolicy;
  }

  public boolean isRequestForWrittenConfirmation() {
    return requestForWrittenConfirmation;
  }

  public void setRequestForWrittenConfirmation(boolean requestForWrittenConfirmation) {
    this.requestForWrittenConfirmation = requestForWrittenConfirmation;
  }

  public Professional getProfessional() {
    return this.getRelatedPersons().stream().collect(StreamUtil.toSingleElement());
  }
}
