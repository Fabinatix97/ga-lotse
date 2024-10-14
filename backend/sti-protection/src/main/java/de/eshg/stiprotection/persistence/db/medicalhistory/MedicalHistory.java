/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.Gender;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "procedure_id", unique = true))
public abstract class MedicalHistory extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY)
  private StiProtectionProcedure procedure;

  @OneToMany(mappedBy = "medicalHistory", cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  private final List<Examination> examinations = new ArrayList<>();

  @OneToMany(mappedBy = "medicalHistory", cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  private final List<Vaccination> vaccinations = new ArrayList<>();

  private String examinationReason;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SexualOrientation sexualOrientation;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Gender sexualContact;

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public List<Examination> getExaminations() {
    return examinations;
  }

  public void addExamination(Examination examination) {
    Assert.notNull(examination, "Examination must not be null");
    examinations.add(examination);
    examination.setMedicalHistory(this);
  }

  public List<Vaccination> getVaccinations() {
    return vaccinations;
  }

  public void addVaccination(Vaccination vaccination) {
    Assert.notNull(vaccination, "Vaccination must not be null");
    vaccinations.add(vaccination);
    vaccination.setMedicalHistory(this);
  }

  public Gender getSexualContact() {
    return sexualContact;
  }

  public void setSexualContact(Gender sexualContact) {
    this.sexualContact = sexualContact;
  }

  public SexualOrientation getSexualOrientation() {
    return sexualOrientation;
  }

  public void setSexualOrientation(SexualOrientation sexualOrientation) {
    this.sexualOrientation = sexualOrientation;
  }

  public String getExaminationReason() {
    return examinationReason;
  }

  public void setExaminationReason(String examinationReason) {
    this.examinationReason = examinationReason;
  }

  public void clearExaminations() {
    examinations.forEach(examination -> examination.setMedicalHistory(null));
    examinations.clear();
  }

  public void clearVaccinations() {
    vaccinations.forEach(vaccination -> vaccination.setMedicalHistory(null));
    vaccinations.clear();
  }
}
