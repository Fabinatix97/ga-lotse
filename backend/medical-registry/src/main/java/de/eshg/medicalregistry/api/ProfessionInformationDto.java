/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Schema(name = "ProfessionInformation")
public record ProfessionInformationDto(
    ProfessionalTitleDto professionalTitle,
    String fieldOfExpertise,
    String specialistTitle,
    String furtherTraining,
    String qualifications,
    LocalDate approbationGrantedOn,
    String approbationIssuingAuthority,
    @Pattern(regexp = "\\d{9}") String lifetimeDoctorNumber,
    EmploymentTypeDto employmentType,
    EmploymentStatusDto employmentStatus) {}
