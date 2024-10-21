/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(name = "Professional")
public record ProfessionalDto(
    @Size(min = 1, max = 119) String title,
    GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    @Size(min = 6, max = 254) String emailAddress,
    @Size(min = 1, max = 23) String phoneNumber,
    @Valid AddressDto address,
    @NotNull ProfessionalTitleDto professionalTitle,
    String fieldOfExpertise,
    String specialistTitle,
    String furtherTraining,
    String qualifications,
    @NotNull LocalDate approbationGrantedOn,
    @NotNull String approbationIssuingAuthority,
    String lifetimeDoctorNumber,
    @NotNull EmploymentTypeDto employmentType,
    @NotNull EmploymentStatusDto employmentStatus,
    @NotNull CountryCode nationality) {
  public ProfessionalDto(
      @NotNull @Size(min = 1, max = 80) String firstName,
      @NotNull @Size(min = 1, max = 120) String lastName,
      @NotNull LocalDate dateOfBirth,
      @NotNull ProfessionalTitleDto professionalTitle,
      @NotNull LocalDate approbationGrantedOn,
      @NotNull String approbationIssuingAuthority,
      @NotNull EmploymentTypeDto employmentType,
      @NotNull EmploymentStatusDto employmentStatus,
      @NotNull CountryCode nationality) {
    this(
        null,
        null,
        firstName,
        lastName,
        dateOfBirth,
        null,
        null,
        null,
        null,
        null,
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
