/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "medical_history_id, disease_type", unique = true))
public class Examination extends BaseEntity {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DiseaseTypes({
    DiseaseType.CHLAMYDIA,
    DiseaseType.GONORRHEA,
    DiseaseType.HEPATITIS_A,
    DiseaseType.HEPATITIS_B,
    DiseaseType.HEPATITIS_C,
    DiseaseType.HIV,
    DiseaseType.SYPHILIS,
  })
  private DiseaseType diseaseType;

  @Column(nullable = false)
  private LocalDate examinationDate;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "medical_history_id")
  private MedicalHistory medicalHistory;

  public MedicalHistory getMedicalHistory() {
    return medicalHistory;
  }

  public void setMedicalHistory(MedicalHistory medicalHistory) {
    this.medicalHistory = medicalHistory;
  }

  public LocalDate getExaminationDate() {
    return examinationDate;
  }

  public void setExaminationDate(LocalDate examinationDate) {
    this.examinationDate = examinationDate;
  }

  public DiseaseType getDiseaseType() {
    return diseaseType;
  }

  public void setDiseaseType(DiseaseType diseaseType) {
    this.diseaseType = diseaseType;
  }
}
