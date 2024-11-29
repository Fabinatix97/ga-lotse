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
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class MedicalRegistryProcedure
    extends Procedure<MedicalRegistryProcedure, MedicalRegistryTask, Professional, Practice> {

  protected MedicalRegistryProcedure() {}

  public MedicalRegistryProcedure(TriggerType triggerType) {
    super(triggerType);
  }

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean consentToPrivacyPolicy;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean requestForWrittenConfirmation;

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
