/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "service_type")
@Table(
    name = "service",
    indexes = {
      @Index(columnList = "procedure_step_id"),
      @Index(columnList = "vaccination_consultation_id")
    })
@EntityListeners(AuditingEntityListener.class)
public abstract class VcService extends GloballyUniqueEntityBase {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @ManyToOne
  @JoinColumn(name = "procedure_step_id")
  private ProcedureStep procedureStep;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @ManyToOne(optional = false)
  @JoinColumn(name = "vaccination_consultation_id")
  private VaccinationConsultation vaccinationConsultation;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @Column(precision = 8, scale = 2)
  @NotNull
  @PositiveOrZero
  private BigDecimal fee;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private LocalDate appliedAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private UUID physician;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private UUID mfa;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @LastModifiedDate
  private Instant modifiedAt;

  protected VcService() {}

  protected VcService(VaccinationConsultation vaccinationConsultation, BigDecimal fee) {
    this.vaccinationConsultation = vaccinationConsultation;
    this.fee = fee;
  }

  public ServiceStatus getServiceStatus() {
    if (this.isAccomplished()) {
      return ServiceStatus.ACCOMPLISHED;
    }
    if (this.isPlanned()) {
      return ServiceStatus.PLANNED;
    }
    return ServiceStatus.OPEN;
  }

  public boolean isAccomplished() {
    return (this.getAppliedAt() != null);
  }

  public boolean isPlanned() {
    return (!this.isAccomplished() && this.getProcedureStep() != null);
  }

  public boolean isOpen() {
    return (!this.isAccomplished() && !this.isPlanned());
  }

  public ProcedureStep getProcedureStep() {
    return procedureStep;
  }

  public void setProcedureStep(ProcedureStep procedureStep) {
    this.procedureStep = procedureStep;
  }

  public VaccinationConsultation getVaccinationConsultation() {
    return vaccinationConsultation;
  }

  public void setVaccinationConsultation(VaccinationConsultation vaccinationConsultation) {
    this.vaccinationConsultation = vaccinationConsultation;
  }

  public BigDecimal getFee() {
    return fee;
  }

  public void setFee(BigDecimal fee) {
    this.fee = fee;
  }

  public LocalDate getAppliedAt() {
    return appliedAt;
  }

  public void setAppliedAt(LocalDate appliedAt) {
    this.appliedAt = appliedAt;
  }

  public UUID getPhysician() {
    return physician;
  }

  public void setPhysician(UUID physician) {
    this.physician = physician;
  }

  public UUID getMfa() {
    return mfa;
  }

  public void setMfa(UUID mfa) {
    this.mfa = mfa;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }
}
