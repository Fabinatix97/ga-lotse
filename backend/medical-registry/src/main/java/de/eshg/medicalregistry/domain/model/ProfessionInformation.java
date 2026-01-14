/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class ProfessionInformation extends SequencedBaseEntity {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private ProfessionalTitle professionalTitle;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String fieldOfExpertise;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String specialistTitle;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String furtherTraining;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String qualifications;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String lifetimeDoctorNumber;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private LocalDate approbationGrantedOn;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private String approbationIssuingAuthority;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private EmploymentType employmentType;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private EmploymentStatus employmentStatus;

  public ProfessionalTitle getProfessionalTitle() {
    return professionalTitle;
  }

  public void setProfessionalTitle(ProfessionalTitle professionalTitle) {
    this.professionalTitle = professionalTitle;
  }

  public String getFieldOfExpertise() {
    return fieldOfExpertise;
  }

  public void setFieldOfExpertise(String fieldOfExpertise) {
    this.fieldOfExpertise = fieldOfExpertise;
  }

  public String getSpecialistTitle() {
    return specialistTitle;
  }

  public void setSpecialistTitle(String specialistTitle) {
    this.specialistTitle = specialistTitle;
  }

  public String getFurtherTraining() {
    return furtherTraining;
  }

  public void setFurtherTraining(String furtherTraining) {
    this.furtherTraining = furtherTraining;
  }

  public String getQualifications() {
    return qualifications;
  }

  public void setQualifications(String qualifications) {
    this.qualifications = qualifications;
  }

  public String getLifetimeDoctorNumber() {
    return lifetimeDoctorNumber;
  }

  public void setLifetimeDoctorNumber(String lifetimeDoctorNumber) {
    this.lifetimeDoctorNumber = lifetimeDoctorNumber;
  }

  public LocalDate getApprobationGrantedOn() {
    return approbationGrantedOn;
  }

  public void setApprobationGrantedOn(LocalDate approbationGrantedOn) {
    this.approbationGrantedOn = approbationGrantedOn;
  }

  public String getApprobationIssuingAuthority() {
    return approbationIssuingAuthority;
  }

  public void setApprobationIssuingAuthority(String approbationIssuingAuthority) {
    this.approbationIssuingAuthority = approbationIssuingAuthority;
  }

  public EmploymentType getEmploymentType() {
    return employmentType;
  }

  public void setEmploymentType(EmploymentType employmentTitle) {
    this.employmentType = employmentTitle;
  }

  public EmploymentStatus getEmploymentStatus() {
    return employmentStatus;
  }

  public void setEmploymentStatus(EmploymentStatus employmentStatus) {
    this.employmentStatus = employmentStatus;
  }
}
