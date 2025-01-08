/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.signature.persistence.entity.TravelMedicineSignature;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "procedure_id"))
public class InformationStatement extends GloballyUniqueEntityBase {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  private String title;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  @Column
  private String content;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  boolean citizenHasAnswered;

  @OneToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private TravelMedicineSignature signature;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "procedure_id")
  private VaccinationConsultation vaccinationConsultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @LastModifiedDate
  private Instant modifiedAt;

  public InformationStatement() {}

  public InformationStatement(String title, String content) {
    this.title = title;
    this.content = content;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  @NotNull
  public boolean isCitizenHasAnswered() {
    return citizenHasAnswered;
  }

  public void setCitizenHasAnswered(@NotNull boolean citizenHasAnswered) {
    this.citizenHasAnswered = citizenHasAnswered;
  }

  public VaccinationConsultation getVaccinationConsultation() {
    return vaccinationConsultation;
  }

  public void setVaccinationConsultation(VaccinationConsultation vaccinationConsultation) {
    this.vaccinationConsultation = vaccinationConsultation;
  }

  public TravelMedicineSignature getSignature() {
    return signature;
  }

  public void setSignature(TravelMedicineSignature signature) {
    this.signature = signature;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
