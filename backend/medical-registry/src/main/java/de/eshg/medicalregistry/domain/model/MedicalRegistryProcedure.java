/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class MedicalRegistryProcedure
    extends Procedure<MedicalRegistryProcedure, MedicalRegistryTask, Person, Practice> {

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
    return getOptionalProfessional()
        .orElseThrow(() -> new IllegalStateException("Expected to find a mandatory professional"));
  }

  public Optional<Professional> getOptionalProfessional() {
    return this.getRelatedPersons().stream()
        .filter(person -> person.hasPersonType(PersonType.PROFESSIONAL))
        .map(Hibernate::unproxy)
        .filter(Professional.class::isInstance)
        .map(Professional.class::cast)
        .collect(StreamUtil.toSingleOptionalElement());
  }

  public List<? extends AbstractEmployee> getEmployees() {
    return this.getRelatedPersons().stream()
        .filter(person -> person.hasPersonType(PersonType.EMPLOYEE))
        .map(Hibernate::unproxy)
        .filter(AbstractEmployee.class::isInstance)
        .map(AbstractEmployee.class::cast)
        .collect(Collectors.toList());
  }
}
