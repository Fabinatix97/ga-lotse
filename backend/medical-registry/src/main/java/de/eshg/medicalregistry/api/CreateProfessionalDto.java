/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.CustomValidations.EmailAddressConstraint;
import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(name = "CreateProfessional")
public record CreateProfessionalDto(
    @Size(min = 1, max = 119) String title,
    @NotNull GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @NotNull @Size(min = 1, max = 40) String nameAtBirth,
    @NotNull @Size(min = 1, max = 50) String placeOfBirth,
    @NotNull @EmailAddressConstraint String emailAddress,
    @NotNull @Size(min = 1, max = 23) String phoneNumber,
    @NotNull @Valid ProfessionalAddressDto address,
    @NotNull ProfessionalTitleDto professionalTitle,
    String fieldOfExpertise,
    String specialistTitle,
    String furtherTraining,
    String qualifications,
    @NotNull LocalDate approbationGrantedOn,
    @NotNull String approbationIssuingAuthority,
    @Pattern(regexp = "\\d{9}") String lifetimeDoctorNumber,
    @NotNull EmploymentTypeDto employmentType,
    @NotNull EmploymentStatusDto employmentStatus,
    @NotNull CountryCode nationality) {

  public CreateProfessionalDto(
      String title,
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String nameAtBirth,
      String placeOfBirth,
      String emailAddress,
      String phoneNumber,
      ProfessionalAddressDto address,
      ProfessionalTitleDto professionalTitle,
      LocalDate approbationGrantedOn,
      String approbationIssuingAuthority,
      EmploymentTypeDto employmentType,
      EmploymentStatusDto employmentStatus,
      CountryCode nationality) {
    this(
        title,
        gender,
        firstName,
        lastName,
        dateOfBirth,
        nameAtBirth,
        placeOfBirth,
        emailAddress,
        phoneNumber,
        address,
        professionalTitle,
        null,
        null,
        null,
        null,
        approbationGrantedOn,
        approbationIssuingAuthority,
        null,
        employmentType,
        employmentStatus,
        nationality);
  }
}
