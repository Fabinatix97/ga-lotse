/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.eshg.infectionbriefing.InfectionBriefingTriggerType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class NewCertificateProcedure extends InfectionBriefingProcedure {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private LocalDate instructionDate;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private InstructionType instructionType;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ApplicantCategory applicantCategory;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CustodianConsent custodianConsent;

  public NewCertificateProcedure() {}

  public NewCertificateProcedure(InfectionBriefingTriggerType triggerType) {
    super(triggerType);
  }

  public LocalDate getInstructionDate() {
    return instructionDate;
  }

  public void setInstructionDate(LocalDate instructionDate) {
    this.instructionDate = instructionDate;
  }

  public InstructionType getInstructionType() {
    return instructionType;
  }

  public void setInstructionType(InstructionType instructionType) {
    this.instructionType = instructionType;
  }

  public ApplicantCategory getApplicantCategory() {
    return applicantCategory;
  }

  public void setApplicantCategory(ApplicantCategory applicantCategory) {
    this.applicantCategory = applicantCategory;
  }

  public CustodianConsent getCustodianConsent() {
    return custodianConsent;
  }

  public void setCustodianConsent(CustodianConsent custodianConsent) {
    this.custodianConsent = custodianConsent;
  }
}
