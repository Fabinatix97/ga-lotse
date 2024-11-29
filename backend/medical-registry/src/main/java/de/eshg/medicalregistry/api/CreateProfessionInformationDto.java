/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Schema(name = "CreateProfessionInformation")
public class CreateProfessionInformationDto {
  private @NotNull ProfessionalTitleDto professionalTitle;
  private String fieldOfExpertise;
  private String specialistTitle;
  private String furtherTraining;
  private String qualifications;
  private @NotNull LocalDate approbationGrantedOn;
  private @NotNull String approbationIssuingAuthority;
  private @Pattern(regexp = "\\d{9}") String lifetimeDoctorNumber;
  private @NotNull EmploymentTypeDto employmentType;
  private @NotNull EmploymentStatusDto employmentStatus;

  public CreateProfessionInformationDto() {}

  public CreateProfessionInformationDto(
      @NotNull ProfessionalTitleDto professionalTitle,
      String fieldOfExpertise,
      String specialistTitle,
      String furtherTraining,
      String qualifications,
      @NotNull LocalDate approbationGrantedOn,
      @NotNull String approbationIssuingAuthority,
      @Pattern(regexp = "\\d{9}") String lifetimeDoctorNumber,
      @NotNull EmploymentTypeDto employmentType,
      @NotNull EmploymentStatusDto employmentStatus) {
    this.professionalTitle = professionalTitle;
    this.fieldOfExpertise = fieldOfExpertise;
    this.specialistTitle = specialistTitle;
    this.furtherTraining = furtherTraining;
    this.qualifications = qualifications;
    this.approbationGrantedOn = approbationGrantedOn;
    this.approbationIssuingAuthority = approbationIssuingAuthority;
    this.lifetimeDoctorNumber = lifetimeDoctorNumber;
    this.employmentType = employmentType;
    this.employmentStatus = employmentStatus;
  }

  public CreateProfessionInformationDto(
      ProfessionalTitleDto professionalTitle,
      LocalDate approbationGrantedOn,
      String approbationIssuingAuthority,
      EmploymentTypeDto employmentType,
      EmploymentStatusDto employmentStatus) {
    this(
        professionalTitle,
        null,
        null,
        null,
        null,
        approbationGrantedOn,
        approbationIssuingAuthority,
        null,
        employmentType,
        employmentStatus);
  }

  public ProfessionalTitleDto getProfessionalTitle() {
    return professionalTitle;
  }

  public void setProfessionalTitle(ProfessionalTitleDto professionalTitle) {
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

  public String getLifetimeDoctorNumber() {
    return lifetimeDoctorNumber;
  }

  public void setLifetimeDoctorNumber(String lifetimeDoctorNumber) {
    this.lifetimeDoctorNumber = lifetimeDoctorNumber;
  }

  public EmploymentTypeDto getEmploymentType() {
    return employmentType;
  }

  public void setEmploymentType(EmploymentTypeDto employmentType) {
    this.employmentType = employmentType;
  }

  public EmploymentStatusDto getEmploymentStatus() {
    return employmentStatus;
  }

  public void setEmploymentStatus(EmploymentStatusDto employmentStatus) {
    this.employmentStatus = employmentStatus;
  }
}
